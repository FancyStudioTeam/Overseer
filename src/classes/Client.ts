import { join, sep } from "node:path";
import type { Nullish } from "@sapphire/utilities";
import { glob } from "glob";
import { Client, Collection, type CreateApplicationCommandOptions } from "oceanic.js";
import type { ChatInputCommand, ChatInputSubCommand, Component, Modal, UserCommand } from "#types";
import { prisma } from "#util/Prisma.js";
import { LoggerType, logger } from "#util/Util.js";

const arrayCommands: CreateApplicationCommandOptions[] = [];

export class Discord extends Client {
  readonly interactions: {
    chatInput: Collection<string, ChatInputCommand | Nullish>;
    user: Collection<string, UserCommand | Nullish>;
  };
  readonly components: {
    buttons: Collection<string, Component | Nullish>;
    selects: Collection<string, Component | Nullish>;
    modals: Collection<string, Modal | Nullish>;
  };
  readonly subCommands: Collection<string, ChatInputSubCommand | Nullish>;
  readonly readyAt: Date;

  constructor() {
    super({
      auth: `Bot ${process.env.CLIENT_TOKEN}`,
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
    this.readyAt = new Date();

    (async () => {
      await this._init();
      this.setMaxListeners(10);
    })();
  }

  async _init(): Promise<void> {
    await this.connect();
    await prisma
      .$connect()
      .then(() => {
        logger(LoggerType.INFO, "Prisma Client has been connected");
      })
      .catch((error) => {
        logger(LoggerType.ERROR, `Prisma Client had an error while connecting: ${error.stack ?? error.message}`);
      });
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

    const paths = await this._loadFiles(`${join(process.cwd(), "src/commands")}/*/*/*.{ts,js}`);

    for (const path of paths) {
      const commandPath = this._resolve(path);
      const command = require(commandPath).default;

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
    }
  }

  async _registerSubCommands(): Promise<void> {
    this.subCommands.clear();

    const paths = await this._loadFiles(`${join(process.cwd(), "src/commands/Chat")}/*/*/*.{ts,js}`);

    for (const path of paths) {
      const subCommandPath = this._resolve(path);
      const subCommand = require(subCommandPath).default;

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
    }
  }

  async _registerComponents(): Promise<void> {
    this.components.buttons.clear();
    this.components.modals.clear();
    this.components.selects.clear();

    const paths = await this._loadFiles(`${join(process.cwd(), "src/components")}/**/*.{ts,js}`);

    for (const path of paths) {
      const componentPath = this._resolve(path);
      const component = require(componentPath).default;

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
    }
  }

  async _registerEvents(): Promise<void> {
    this.removeAllListeners();

    const paths = await this._loadFiles(`${join(process.cwd(), "src/events")}/*/*.{ts,js}`);

    for (const path of paths) {
      const eventPath = this._resolve(path);

      require(eventPath);
    }
  }

  async _registerModules(): Promise<void> {
    const paths = await this._loadFiles(`${join(process.cwd(), "src/modules")}/*.{ts,js}`);

    for (const path of paths) {
      const modulePath = this._resolve(path);
      const module = require(modulePath).default;

      module(this);
    }
  }

  private _resolve(path: string): string {
    return path.split(sep).includes("dist") ? path : join(process.cwd(), path);
  }

  private async _loadFiles(path: string | string[]): Promise<string[]> {
    return await glob(path, {
      ignore: ["node_modules/**"],
    });
  }
}

type Commands = "CHAT" | "USER";

type Components = "BUTTONS" | "MODALS" | "SELECTS";

type CommandCollections = Collection<string, ChatInputCommand | Nullish> | Collection<string, UserCommand | Nullish>;

type ComponentCollections = Collection<string, Component | Nullish> | Collection<string, Modal | Nullish>;
