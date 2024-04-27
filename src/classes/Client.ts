import { readdirSync } from "node:fs";
import { join, sep } from "node:path";
import figlet from "figlet";
import {
  Client,
  type ClientEvents,
  Collection,
  type CreateApplicationCommandOptions,
} from "oceanic.js";
import {
  type ChatInputCommandInterface,
  type ComponentInterface,
  LoggerType,
  type ModalInterface,
  type SubCommandInterface,
  type UserCommandInterface,
} from "../types";
import { prisma } from "../util/db";
import { logger } from "../util/util";
import type { Event } from "./Builders";

const arrayCommands: CreateApplicationCommandOptions[] = [];

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
  private dbReady: boolean;
  readyAt: Date;

  constructor() {
    super({
      auth: `Bot ${process.env.Token}`,
      collectionLimits: {
        auditLogEntries: 0,
        autoModerationRules: 0,
        channels: Number.POSITIVE_INFINITY,
        emojis: 0,
        groupChannels: 0,
        guildThreads: Number.POSITIVE_INFINITY,
        guilds: Number.POSITIVE_INFINITY,
        integrations: 0,
        invites: 0,
        members: Number.POSITIVE_INFINITY,
        messages: 0,
        privateChannels: 0,
        roles: Number.POSITIVE_INFINITY,
        scheduledEvents: 0,
        stageInstances: 0,
        stickers: 0,
        unavailableGuilds: 0,
        users: Number.POSITIVE_INFINITY,
        voiceMembers: 0,
        voiceStates: 0,
      },
      gateway: {
        compress: true,
        intents: [
          "GUILDS",
          "GUILD_MEMBERS",
          "GUILD_MESSAGES",
          "MESSAGE_CONTENT",
        ],
        maxShards: "auto",
        concurrency: "auto",
        autoReconnect: true,
      },
      defaultImageSize: 512,
      defaultImageFormat: "png",
      allowedMentions: {
        everyone: false,
      },
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
    this.dbReady = false;
    this.readyAt = new Date();
  }

  async init(): Promise<void> {
    logger(LoggerType.INFO, "Initializing Fancycord...");

    figlet("Hello, world!", (error: Error | null, text: string | undefined) => {
      if (error) {
        logger(LoggerType.ERROR, error.stack ?? error.message);
      }

      console.log(`${text}\n`);
    });

    if (!this.dbReady) {
      await prisma
        .$connect()
        .then(() => {
          this.dbReady = true;
          logger(LoggerType.INFO, "Prisma Client has been connected");
        })
        .catch((error) => {
          logger(
            LoggerType.ERROR,
            `Prisma Client had an error while connecting: ${
              error.stack ?? error.message
            }`
          );
        });
    }

    if (!this.ready) {
      await this.connect();
    }

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

    await this.rest.applications
      .bulkEditGlobalCommands(this.application.id, arrayCommands)
      .then((commands) => {
        logger(
          LoggerType.INFO,
          `The interactions has been deployed | Deployed ${commands.length} interactions`
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
}
