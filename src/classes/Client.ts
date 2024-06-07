import { join, sep } from "node:path";
import type { Nullish } from "@sapphire/utilities";
import { textSync } from "figlet";
import { glob } from "glob";
import { Client, Collection, type CreateApplicationCommandOptions } from "oceanic.js";
import { prisma } from "#prisma";
import type {
  ChatInputCommandInterface,
  ChatInputSubCommandInterface,
  ComponentInterface,
  ModalInterface,
  UserCommandInterface,
} from "#types";
import { LoggerType, logger } from "#util";

const arrayCommands: CreateApplicationCommandOptions[] = [];

export class Discord extends Client {
  interactions: {
    chatInput: Collection<string, ChatInputCommandInterface | Nullish>;
    user: Collection<string, UserCommandInterface | Nullish>;
  };
  components: {
    buttons: Collection<string, ComponentInterface | Nullish>;
    selects: Collection<string, ComponentInterface | Nullish>;
    modals: Collection<string, ModalInterface | Nullish>;
  };
  subCommands: Collection<string, ChatInputSubCommandInterface | Nullish>;
  #dbReady: boolean;
  readonly readyAt: Date;

  constructor() {
    super({
      auth: `Bot ${process.env.TOKEN}`,
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
        connectionProperties: {
          browser: "Discord Android",
        },
        compress: true,
        intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "MESSAGE_CONTENT"],
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
      selects: new Collection(),
      modals: new Collection(),
    };
    this.subCommands = new Collection();
    this.#dbReady = false;
    this.readyAt = new Date();
  }

  async _init(): Promise<void> {
    console.log(textSync("Initializing ..."), "\n");

    if (!this.#dbReady) {
      await prisma
        .$connect()
        .then(() => {
          logger(LoggerType.INFO, "Prisma Client has been connected");
          this.#dbReady = true;
        })
        .catch((error) => {
          logger(LoggerType.ERROR, `Prisma Client had an error while connecting: ${error.stack ?? error.message}`);
        });
    }

    if (!this.ready) {
      await this.connect();
    }

    await Promise.allSettled([this._registerComponents(), this._registerEvents(), this._registerModules()]);
  }

  async _deploy(): Promise<void> {
    await this._registerCommands();
    await this.rest.applications.bulkEditGlobalCommands(this.application.id, arrayCommands).then((commands) => {
      logger(LoggerType.INFO, `The interactions has been deployed | Deployed ${commands.length} interactions`);
    });
  }

  async _registerCommands(): Promise<void> {
    this.interactions.chatInput.clear();
    this.interactions.user.clear();

    await this._registerSubCommands();

    const files = await this.#loadFiles(`${join(__dirname, "..", "commands")}/*/*/*.{ts,js}`);

    files.forEach((path, _) => {
      const commandPath = join(process.cwd(), path);
      const command = require(commandPath).default;

      delete require.cache[require.resolve(commandPath)];

      if (command?.name) {
        const dividedPath = commandPath.split(sep);
        const directory = <Commands>dividedPath[dividedPath.length - 3].toUpperCase();
        const collections: Record<Commands, CommandCollections> = {
          CHAT: this.interactions.chatInput,
          USER: this.interactions.user,
        };

        collections[directory].set(command.name, command);
        arrayCommands.push(command);
      }
    });
  }

  async _registerSubCommands(): Promise<void> {
    this.subCommands.clear();

    const files = await this.#loadFiles(`${join(__dirname, "..", "commands/Chat")}/*/*/*.{ts,js}`);

    files.forEach((path, _) => {
      const subCommandPath = join(process.cwd(), path);
      const subCommand = require(subCommandPath).default;

      delete require.cache[require.resolve(subCommandPath)];

      if (subCommand?.name) {
        const dividedPath = subCommandPath.split(sep);
        const directory = dividedPath[dividedPath.length - 3].toUpperCase();
        const directories: Record<string, string> = {
          CONFIGURATION: "CONFIG",
          INFORMATION: "INFO",
          MODERATION: "MOD",
          UTILITY: "UTIL",
        };

        this.subCommands.set(`${directories[directory].toLowerCase()}_${subCommand.name}`.toLowerCase(), subCommand);
      }
    });
  }

  async _registerComponents(): Promise<void> {
    this.components.buttons.clear();
    this.components.modals.clear();
    this.components.selects.clear();

    const files = await this.#loadFiles(`${join(__dirname, "..", "components")}/**/*.{ts,js}`);

    files.forEach((path, _) => {
      const componentPath = join(process.cwd(), path);
      const component = require(componentPath).default;

      delete require.cache[require.resolve(componentPath)];

      if (component?.name) {
        const dividedPath = componentPath.split(sep);
        const directory = <Components>dividedPath[dividedPath.length - 3].toUpperCase();
        const collections: Record<Components, ComponentCollections> = {
          BUTTONS: this.components.buttons,
          MODALS: this.components.modals,
          SELECTS: this.components.selects,
        };

        collections[directory].set(component.name, component);
      }
    });
  }

  async _registerEvents(): Promise<void> {
    this.removeAllListeners();

    const files = await this.#loadFiles(`${join(__dirname, "..", "events")}/*/*.{ts,js}`);

    files.forEach((path, _) => {
      const eventPath = join(process.cwd(), path);

      delete require.cache[require.resolve(eventPath)];
      require(eventPath).default;
    });
  }

  async _registerModules(): Promise<void> {
    const files = await this.#loadFiles(`${join(__dirname, "..", "modules")}/*.{ts,js}`);

    files.forEach((path, _) => {
      const modulePath = join(process.cwd(), path);
      const module = require(modulePath).default;

      delete require.cache[require.resolve(modulePath)];
      module(this);
    });
  }

  async #loadFiles(path: string | string[]): Promise<string[]> {
    return await glob(path, {
      ignore: ["node_modules/**"],
    });
  }
}

type Commands = "CHAT" | "USER";

type Components = "BUTTONS" | "MODALS" | "SELECTS";

type CommandCollections =
  | Collection<string, ChatInputCommandInterface | Nullish>
  | Collection<string, UserCommandInterface | Nullish>;

type ComponentCollections =
  | Collection<string, ComponentInterface | Nullish>
  | Collection<string, ModalInterface | Nullish>;
