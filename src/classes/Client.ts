import { readdirSync } from "node:fs";
import { join, sep } from "node:path";
import figlet from "figlet";
import i18n from "i18n";
import {
  Client,
  type ClientEvents,
  Collection,
  type CreateApplicationCommandOptions,
} from "oceanic.js";
import { EmbedBuilder } from "../builders/Embed";
import config from "../misc/config";
import {
  type ChatInputCommandInterface,
  type ComponentInterface,
  LogType,
  type ModalInterface,
  type SubCommandInterface,
  type UserCommandInterface,
  WebhookType,
} from "../types";
import { prisma } from "../util/db";
import { logger, webhook } from "../util/util";
import type { Event } from "./Builders";

const arrayCommands: object[] = [];

export class Fancycord extends Client {
  interactions: {
    chatInput: Collection<string, ChatInputCommandInterface>;
    user: Collection<string, UserCommandInterface>;
  };
  components: {
    buttons: Collection<string, ComponentInterface>;
    select: Collection<string, ComponentInterface>;
    modals: Collection<string, ModalInterface>;
  };
  subcommands: Collection<string, SubCommandInterface>;
  config: Config;
  locales: i18n.I18n;
  private dbReady: boolean;
  readyAt: number | null;

  constructor() {
    super({
      auth: `Bot ${process.env.Token}`,
      collectionLimits: {
        auditLogEntries: 0,
        autoModerationRules: 0,
        channels: Infinity,
        emojis: 0,
        groupChannels: 0,
        guildThreads: Infinity,
        guilds: Infinity,
        integrations: 0,
        invites: 0,
        members: Infinity,
        messages: 0,
        privateChannels: 0,
        roles: Infinity,
        scheduledEvents: 0,
        stageInstances: 0,
        stickers: 0,
        unavailableGuilds: 0,
        users: Infinity,
        voiceMembers: 0,
        voiceStates: 0,
      },
      gateway: {
        connectionProperties: {
          browser: "Discord Android",
        },
        intents: [
          "GUILDS",
          "GUILD_MEMBERS",
          "GUILD_MESSAGES",
          "GUILD_MESSAGE_REACTIONS",
          "MESSAGE_CONTENT",
        ],
        maxShards: "auto",
        concurrency: "auto",
        autoReconnect: true,
      },
      defaultImageSize: 512,
      defaultImageFormat: "png",
    });

    this.interactions = {
      chatInput: new Collection(),
      user: new Collection(),
    };
    this.components = {
      buttons: new Collection(),
      select: new Collection(),
      modals: new Collection(),
    };
    this.subcommands = new Collection();
    this.config = config;
    this.locales = i18n;
    this.dbReady = false;
    this.readyAt = null;
  }

  get _uptime(): number {
    return this.readyAt ? Date.now() - this.readyAt : 0;
  }

  async init(): Promise<void> {
    logger("[Fancycord] Initializing Fancycord...");

    figlet("Fancycord", (error: Error | null, text: string | undefined) => {
      if (error) {
        logger(`[Error] ${error.stack ?? error.message}`, LogType.Error);
      }

      console.log(`\x1b[0;97m${text}\x1b[0m\n`);
    });

    if (!this.dbReady) {
      await prisma
        .$connect()
        .then(() => {
          this.dbReady = true;
          logger("[Prisma] Prisma Client has been connected", LogType.Database);
        })
        .catch((error) => {
          logger(
            `[Prisma] Prisma Client had an error while connecting: ${error.stack}`,
            LogType.Error
          );
        });
    }

    if (!this.ready) {
      await this.connect().then(() => {
        this.readyAt = Date.now();
      });
    }

    this.registerLocales();
    this.registerSubCommands();
    this.registerButtons();
    this.registerSelectMenus();
    this.registerModals();
    this.registerEvents();
    this.registerModules();
  }

  async deploy(): Promise<void> {
    this.registerChatInputCommands();
    this.registerUserCommands();

    await this.rest.applicationCommands
      .bulkEditGlobalCommands(
        this.application.id,
        arrayCommands as CreateApplicationCommandOptions[]
      )
      .then((commands) => {
        commands.forEach((c, _) => {
          const command = this.interactions.chatInput.get(c.name);

          if (command) {
            command.id = c.id;
            this.interactions.chatInput.set(c.name, command);
          }
        });

        logger(
          `[${this.user.username}] The interactions has been deployed | Deployed ${commands.length} interactions`
        );
      })
      .catch(() => null);
  }

  registerChatInputCommands(): void {
    this.interactions.chatInput.clear();

    const commandsPath = join(__dirname, "..", "commands", "chatInput");
    const commands = readdirSync(commandsPath);

    commands.forEach((d, _) => {
      const directoriesPath = join(commandsPath, d);
      const directories = readdirSync(directoriesPath).filter(
        (f) => f.endsWith(".js") || f.endsWith(".ts")
      );

      directories.forEach((f, _) => {
        const commandPath = join(directoriesPath, f);
        const command: ChatInputCommandInterface = require(commandPath).default;

        delete require.cache[require.resolve(commandPath)];

        if (command?.name) {
          this.interactions.chatInput.set(command.name, command);

          arrayCommands.push(command);
        }
      });
    });
  }

  registerSubCommands(): void {
    this.subcommands.clear();

    const commandsPath = join(__dirname, "..", "commands", "chatInput");
    const commands = readdirSync(commandsPath);

    commands.forEach((d, _) => {
      const directoriesPath = join(commandsPath, d, "subcommands");
      const directories = readdirSync(directoriesPath).filter(
        (f) => f.endsWith(".js") || f.endsWith(".ts")
      );

      directories.forEach((f, _) => {
        const commandPath = join(directoriesPath, f);
        const command: SubCommandInterface = require(commandPath).default;
        const dividedPath = commandPath.split(sep);

        delete require.cache[require.resolve(commandPath)];

        if (command?.name) {
          this.subcommands.set(
            `${dividedPath[dividedPath.indexOf("subcommands") - 1]}_${
              command.name
            }`,
            command
          );
        }
      });
    });
  }

  registerUserCommands(): void {
    this.interactions.user.clear();

    const commandsPath = join(__dirname, "..", "commands", "user");
    const commands = readdirSync(commandsPath);

    commands.forEach((d, _) => {
      const directoriesPath = join(commandsPath, d);
      const directories = readdirSync(directoriesPath).filter(
        (f) => f.endsWith(".js") || f.endsWith(".ts")
      );

      directories.forEach((f, _) => {
        const commandPath = join(directoriesPath, f);
        const command: UserCommandInterface = require(commandPath).default;

        delete require.cache[require.resolve(commandPath)];

        if (command?.name) {
          this.interactions.user.set(command.name, command);

          arrayCommands.push(command);
        }
      });
    });
  }

  registerEvents(): void {
    this.removeAllListeners();

    const eventsPath = join(__dirname, "..", "events");
    const events = readdirSync(eventsPath);

    events.forEach((d, _) => {
      const directoriesPath = join(eventsPath, d);
      const directories = readdirSync(directoriesPath).filter(
        (f) => f.endsWith(".js") || f.endsWith(".ts")
      );

      directories.forEach((f, _) => {
        const eventPath = join(directoriesPath, f);
        const event: Event<keyof ClientEvents> = require(eventPath).default;

        delete require.cache[require.resolve(eventPath)];

        if (event?.event) {
          event.once
            ? this.once(event.event, event.run)
            : this.on(event.event, event.run);
        }
      });
    });
  }

  registerButtons(): void {
    this.components.buttons.clear();

    const buttonsPath = join(__dirname, "..", "components", "buttons");
    const buttons = readdirSync(buttonsPath);

    buttons.forEach((d, _) => {
      const directoriesPath = join(buttonsPath, d);
      const directories = readdirSync(directoriesPath).filter(
        (f) => f.endsWith(".js") || f.endsWith(".ts")
      );

      directories.forEach((f, _) => {
        const buttonPath = join(directoriesPath, f);
        const button: ComponentInterface = require(buttonPath).default;

        delete require.cache[require.resolve(buttonPath)];

        if (button?.name) {
          this.components.buttons.set(button.name, button);
        }
      });
    });
  }

  registerSelectMenus(): void {
    this.components.select.clear();

    const selectMenusPath = join(__dirname, "..", "components", "selectMenu");
    const selectMenus = readdirSync(selectMenusPath);

    selectMenus.forEach((d, _) => {
      const directoriesPath = join(selectMenusPath, d);
      const directories = readdirSync(directoriesPath).filter(
        (f) => f.endsWith(".js") || f.endsWith(".ts")
      );

      directories.forEach((f, _) => {
        const selectMenuPath = join(directoriesPath, f);
        const selectMenu: ComponentInterface = require(selectMenuPath).default;

        delete require.cache[require.resolve(selectMenuPath)];

        if (selectMenu?.name) {
          this.components.select.set(selectMenu.name, selectMenu);
        }
      });
    });
  }

  registerModals(): void {
    this.components.modals.clear();

    const modalsPath = join(__dirname, "..", "components", "modals");
    const modals = readdirSync(modalsPath);

    modals.forEach((d, _) => {
      const directoriesPath = join(modalsPath, d);
      const directories = readdirSync(directoriesPath).filter(
        (f) => f.endsWith(".js") || f.endsWith(".ts")
      );

      directories.forEach((f, _) => {
        const modalPath = join(directoriesPath, f);
        const modal: ModalInterface = require(modalPath).default;

        delete require.cache[require.resolve(modalPath)];

        if (modal?.name) {
          this.components.modals.set(modal.name, modal);
        }
      });
    });
  }

  registerModules(): void {
    const modulesPath = join(__dirname, "..", "modules");
    const modules = readdirSync(modulesPath).filter(
      (f) => f.endsWith(".js") || f.endsWith(".ts")
    );

    modules.forEach((f, _) => {
      const modulePath = join(modulesPath, f);
      const module = require(modulePath).default;

      delete require.cache[require.resolve(modulePath)];

      module(this);
    });
  }

  registerLocales(): void {
    this.locales.configure({
      locales: ["en", "es"],
      directory: join(__dirname, "..", "locales"),
      retryInDefaultLocale: true,
      objectNotation: true,
      register: global,
      autoReload: true,
      missingKeyFn: (locale, value) => {
        logger(
          `[I18N] Missing translation line in "${locale}" language\n${value}`,
          LogType.Error
        );
        webhook(WebhookType.Logs, {
          embeds: new EmbedBuilder()
            .setAuthor({
              name: this.user.username,
              iconURL: this.user.avatarURL(),
            })
            .setDescription(
              `\`\`\`js\nMissing translation line in "${locale}" language\n${value}\`\`\``
            )
            .setColor(this.config.colors.error)
            .toJSONArray(),
        });

        return `Missing translation line in "${locale}" language`;
      },
      mustacheConfig: {
        tags: ["{{", "}}"],
        disable: false,
      },
    });
    this.locales.setLocale("en");
  }
}

interface Config {
  colors: {
    color: number;
    success: number;
    error: number;
    warning: number;
  };
  links: {
    invite: string;
    support: string;
  };
}
