import { join, sep } from "node:path";
import { glob } from "glob";
import {
  Client,
  Collection,
  type CreateApplicationCommandOptions,
  type Guild,
  type Member,
  type User,
} from "oceanic.js";
import { match } from "ts-pattern";
import type { Awaitable, MaybeNullish } from "#types";
import type { createChatInput, createChatInputSubCommand, createUserCommand } from "#util/Handlers.js";
import { prisma } from "#util/Prisma.js";
import { LoggerType, logger } from "#util/Util.js";

const commandsArray: CreateApplicationCommandOptions[] = [];

export class Discord extends Client {
  readonly interactions: {
    chatInput: Collection<string, MaybeNullish<Parameters<typeof createChatInput>[0]>>;
    user: Collection<string, MaybeNullish<Parameters<typeof createUserCommand>[0]>>;
  };
  /*readonly components: {
    buttons: Collection<string, Component | Nullish>;
    selects: Collection<string, Component | Nullish>;
    modals: Collection<string, Modal | Nullish>;
  };*/
  readonly subCommands: Collection<string, MaybeNullish<Parameters<typeof createChatInputSubCommand>[0]>>;
  readonly readyAt: Date;

  constructor() {
    super({
      allowedMentions: {
        everyone: false,
      },
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
      defaultImageFormat: "png",
      defaultImageSize: 512,
      gateway: {
        autoReconnect: true,
        concurrency: "auto",
        dispatcher: {
          blacklist: [
            "APPLICATION_COMMAND_PERMISSIONS_UPDATE",
            "AUTO_MODERATION_ACTION_EXECUTION",
            "AUTO_MODERATION_RULE_CREATE",
            "AUTO_MODERATION_RULE_DELETE",
            "AUTO_MODERATION_RULE_UPDATE",
            "ENTITLEMENT_CREATE",
            "ENTITLEMENT_DELETE",
            "ENTITLEMENT_UPDATE",
            "GUILD_AUDIT_LOG_ENTRY_CREATE",
            "GUILD_BAN_ADD",
            "GUILD_BAN_REMOVE",
            "GUILD_INTEGRATIONS_UPDATE",
            "GUILD_SCHEDULED_EVENT_CREATE",
            "GUILD_SCHEDULED_EVENT_DELETE",
            "GUILD_SCHEDULED_EVENT_UPDATE",
            "GUILD_SCHEDULED_EVENT_USER_ADD",
            "GUILD_SCHEDULED_EVENT_USER_REMOVE",
            "INTEGRATION_CREATE",
            "INTEGRATION_DELETE",
            "INTEGRATION_UPDATE",
            "MESSAGE_DELETE_BULK",
            "MESSAGE_POLL_VOTE_ADD",
            "MESSAGE_POLL_VOTE_REMOVE",
            "MESSAGE_REACTION_ADD",
            "MESSAGE_REACTION_REMOVE",
            "MESSAGE_REACTION_REMOVE_ALL",
            "MESSAGE_REACTION_REMOVE_EMOJI",
            "PRESENCE_UPDATE",
            "STAGE_INSTANCE_CREATE",
            "STAGE_INSTANCE_DELETE",
            "STAGE_INSTANCE_UPDATE",
            "THREAD_LIST_SYNC",
            "THREAD_MEMBERS_UPDATE",
            "THREAD_MEMBER_UPDATE",
            "TYPING_START",
            "VOICE_CHANNEL_EFFECT_SEND",
            "VOICE_CHANNEL_STATUS_UPDATE",
            "VOICE_SERVER_UPDATE",
            "VOICE_STATE_UPDATE",
            "WEBHOOKS_UPDATE",
          ],
          whitelist: ["INTERACTION_CREATE", "MESSAGE_CREATE", "READY", "RESUMED"],
        },
        intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "MESSAGE_CONTENT"],
        maxShards: "auto",
      },
    });

    this.interactions = {
      chatInput: new Collection(),
      user: new Collection(),
    };
    /*this.components = {
      buttons: new Collection(),
      selects: new Collection(),
      modals: new Collection(),
    };*/
    this.subCommands = new Collection();
    this.readyAt = new Date();

    (async () => {
      await this.init();
      this.setMaxListeners(10);
    })();
  }

  async init() {
    await this.connect();
    await prisma
      .$connect()
      .then(() => logger("Prisma Client has been connected"))
      .catch((error) =>
        logger(error.stack ?? error.message, {
          type: LoggerType.ERROR,
        }),
      );
    await Promise.allSettled([this.registerEvents(), this.registerModules()]);
  }

  async deploy() {
    await this.registerCommands();
    await this.rest.applications
      .bulkEditGlobalCommands(this.application.id, commandsArray)
      .then((commands) => logger(`The interactions have been deployed | Deployed ${commands.length} interactions`));
  }

  async registerCommands() {
    this.interactions.chatInput.clear();
    this.interactions.user.clear();

    await this.registerSubCommands();

    const paths = await this.loadFiles(`${join(process.cwd(), "src/commands")}/*/*/*.{ts,js}`);

    for (const path of paths) {
      const commandPath = this.resolve(path);
      const command = require(commandPath).default;

      if (command?.name) {
        const dividedPath = commandPath.split(sep);
        const directory = <Commands>dividedPath[dividedPath.length - 3].toUpperCase();
        const collections: Record<Commands, CommandCollections> = {
          CHAT: this.interactions.chatInput,
          USER: this.interactions.user,
        };

        collections[directory].set(command.name, command);
        commandsArray.push(command);
      }
    }
  }

  async registerSubCommands() {
    this.subCommands.clear();

    const paths = await this.loadFiles(`${join(process.cwd(), "src/commands/Chat")}/*/*/*.{ts,js}`);

    for (const path of paths) {
      const subCommandPath = this.resolve(path);
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

  /*async registerComponents(): Promise<void> {
    this.components.buttons.clear();
    this.components.modals.clear();
    this.components.selects.clear();

    const paths = await this.loadFiles(`${join(process.cwd());

    for (const path of paths) {
      const componentPath = this.resolve(path);
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
  }*/

  async registerEvents() {
    this.removeAllListeners();

    const paths = await this.loadFiles(`${join(process.cwd(), "src/events")}/*/*.{ts,js}`);

    for (const path of paths) {
      const eventPath = this.resolve(path);

      require(eventPath);
    }
  }

  async registerModules() {
    const paths = await this.loadFiles(`${join(process.cwd(), "src/modules")}/*.{ts,js}`);

    for (const path of paths) {
      const modulePath = this.resolve(path);
      const module = require(modulePath).default;

      module(this);
    }
  }

  async fetchUser(
    userID: string,
    {
      type,
    }: {
      type: FetchFrom;
    } = {
      type: FetchFrom.DEFAULT,
    },
  ): Promise<MaybeNullish<User>> {
    return match(type)
      .returnType<Awaitable<MaybeNullish<User>>>()
      .with(FetchFrom.DEFAULT, async () => this.users.get(userID) ?? (await this.rest.users.get(userID)))
      .with(FetchFrom.CACHE, () => this.users.get(userID))
      .with(FetchFrom.REST, async () => await this.rest.users.get(userID))
      .otherwise(() => undefined);
  }

  async fetchMember(
    guild: Guild,
    memberID: string,
    {
      type,
    }: {
      type: FetchFrom;
    } = {
      type: FetchFrom.DEFAULT,
    },
  ): Promise<MaybeNullish<Member>> {
    return match(type)
      .returnType<Awaitable<MaybeNullish<Member>>>()
      .with(
        FetchFrom.DEFAULT,
        async () => guild.members.get(memberID) ?? (await this.rest.guilds.getMember(guild.id, memberID)),
      )
      .with(FetchFrom.CACHE, () => guild.members.get(memberID))
      .with(FetchFrom.REST, async () => await this.rest.guilds.getMember(guild.id, memberID))
      .otherwise(() => undefined);
  }

  private resolve(path: string) {
    return path.split(sep).includes("dist") ? path : join(process.cwd(), path);
  }

  private async loadFiles(path: string | string[]) {
    return await glob(path, {
      ignore: ["node_modules/**"],
    });
  }
}

type Commands = "CHAT" | "USER";

// type Components = "BUTTONS" | "MODALS" | "SELECTS";

type CommandCollections =
  | Collection<string, MaybeNullish<Parameters<typeof createChatInput>[0]>>
  | Collection<string, MaybeNullish<Parameters<typeof createUserCommand>[0]>>;

// type ComponentCollections = Collection<string, Component | Nullish> | Collection<string, Modal | Nullish>;

export enum FetchFrom {
  DEFAULT,
  CACHE,
  REST,
}
