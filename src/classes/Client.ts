import { join, sep } from "node:path";
import { PrismaClient } from "@prisma/client";
import type {
  ChatInputCommandData,
  ChatInputSubCommandData,
  ComponentData,
  MaybeNullish,
  PrefixCommandData,
  UserCommandData,
} from "@types";
import { LoggerType, logger } from "@utils";
import { glob } from "glob";
import {
  ApplicationCommandTypes,
  Client,
  Collection,
  ComponentTypes,
  type CreateApplicationCommandOptions,
  type Guild,
  type Member,
  type User,
} from "oceanic.js";
import { match } from "ts-pattern";

const commandsArray: CreateApplicationCommandOptions[] = [];

export class Discord extends Client {
  readonly interactions: {
    chatInput: Collection<string, MaybeNullish<ChatInputCommandData>>;
    user: Collection<string, MaybeNullish<UserCommandData>>;
  };
  readonly components: {
    buttons: Collection<string, MaybeNullish<ComponentData>>;
    selectMenus: Collection<string, MaybeNullish<ComponentData>>;
  };
  readonly subCommands: Collection<string, MaybeNullish<ChatInputSubCommandData>>;
  readonly readyAt: Date;
  readonly prefixCommands: Collection<string, MaybeNullish<PrefixCommandData>>;
  readonly prisma: PrismaClient;

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
    this.components = {
      buttons: new Collection(),
      selectMenus: new Collection(),
    };
    this.subCommands = new Collection();
    this.readyAt = new Date();
    this.prefixCommands = new Collection();
    this.prisma = new PrismaClient();

    (async () => {
      await this.init();
      this.setMaxListeners(10);
    })();
  }

  init = async () => {
    await this.connect();
    await this.prisma
      .$connect()
      .then(() => logger("Prisma Client has been connected"))
      .catch((error) =>
        logger(error.stack ?? error.message, {
          type: LoggerType.ERROR,
        }),
      );
    await Promise.all([
      this.registerComponents(),
      this.registerPrefixCommands(),
      this.registerEvents(),
      this.registerModules(),
    ]);
  };

  deploy = async () => {
    await this.registerCommands();
    await this.rest.applications
      .bulkEditGlobalCommands(this.application.id, commandsArray)
      .then((commands) => logger(`The interactions have been deployed | Deployed ${commands.length} interactions`));
  };

  registerCommands = async () => {
    this.interactions.chatInput.clear();
    this.interactions.user.clear();

    await this.registerSubCommands();
    await this.#loadFiles(`${join(__dirname, "..", "commands")}/*/*/*.{ts,js}`).then((paths) => {
      for (const path of paths) {
        const commandPath = this.#resolve(path);
        const command = require(commandPath).default;

        if (!("name" in command || "type" in command)) {
          throw new Error(`Command path "${commandPath}" is missing a name or type property`);
        }

        match(command.type)
          .with(ApplicationCommandTypes.CHAT_INPUT, () => this.interactions.chatInput.set(command.name, command))
          .with(ApplicationCommandTypes.USER, () => this.interactions.user.set(command.name, command))
          .otherwise((type) => {
            throw new Error(`Unknown command type: ${type}`);
          });

        commandsArray.push(command);
      }
    });
  };

  registerComponents = async () => {
    this.components.buttons.clear();
    this.components.selectMenus.clear();

    await this.#loadFiles(`${join(__dirname, "..", "components")}/*/*/*.{ts,js}`).then((paths) => {
      for (const path of paths) {
        const componentPath = this.#resolve(path);
        const component = require(componentPath).default;

        if (!("name" in component || "type" in component || "run" in component)) {
          throw new Error(`Command path "${componentPath}" is missing a name or type property`);
        }

        match(component.type)
          .with(ComponentTypes.BUTTON, () => this.components.buttons.set(component.name, component))
          .with(
            [
              ComponentTypes.CHANNEL_SELECT,
              ComponentTypes.MENTIONABLE_SELECT,
              ComponentTypes.ROLE_SELECT,
              ComponentTypes.STRING_SELECT,
              ComponentTypes.USER_SELECT,
            ].includes(component.type),
            () => this.components.selectMenus.set(component.name, component),
          )
          .otherwise((type) => {
            throw new Error(`Unknown command type: ${type}`);
          });
      }
    });
  };

  registerSubCommands = async () => {
    this.subCommands.clear();

    await this.#loadFiles(`${join(__dirname, "..", "commands/chatInput")}/*/*/*.{ts,js}`).then((paths) => {
      for (const path of paths) {
        const subCommandPath = this.#resolve(path);
        const subCommand = require(subCommandPath).default;

        if (!("name" in subCommand || "run" in subCommand)) {
          throw new Error(`SubCommand path "${subCommandPath}" is missing a name or run property`);
        }

        const dividedPath = subCommandPath.split(sep);
        const directory = dividedPath[dividedPath.length - 3].toLowerCase();

        this.subCommands.set(`${directory}_${subCommand.name}`, subCommand);
      }
    });
  };

  registerPrefixCommands = async () => {
    this.prefixCommands.clear();

    await this.#loadFiles(`${join(__dirname, "..", "commands/prefix")}/*.{ts,js}`).then((paths) => {
      for (const path of paths) {
        const prefixCommandPath = this.#resolve(path);
        const prefixCommand = require(prefixCommandPath).default;

        if (!("name" in prefixCommand || "run" in prefixCommand)) {
          throw new Error(`PrefixCommand path "${prefixCommandPath}" is missing a name or run property`);
        }

        this.prefixCommands.set(prefixCommand.name, prefixCommand);
      }
    });
  };

  registerEvents = async () => {
    this.removeAllListeners();

    await this.#loadFiles(`${join(__dirname, "..", "events")}/*/*.{ts,js}`).then((paths) => {
      for (const path of paths) {
        require(this.#resolve(path));
      }
    });
  };

  registerModules = async () =>
    await this.#loadFiles(`${join(__dirname, "..", "modules")}/*.{ts,js}`).then((paths) => {
      for (const path of paths) {
        require(this.#resolve(path)).default(this);
      }
    });

  fetchUser = async (
    userId: string,
    {
      type,
    }: {
      type: FetchFrom;
    } = {
      type: FetchFrom.DEFAULT,
    },
  ): Promise<MaybeNullish<User>> =>
    match(type)
      .with(FetchFrom.DEFAULT, async () => this.users.get(userId) ?? (await this.rest.users.get(userId)))
      .with(FetchFrom.CACHE, () => this.users.get(userId))
      .with(FetchFrom.REST, async () => await this.rest.users.get(userId))
      .otherwise(() => undefined);

  fetchMember = async (
    guild: Guild,
    memberId: string,
    {
      type,
    }: {
      type: FetchFrom;
    } = {
      type: FetchFrom.DEFAULT,
    },
  ): Promise<MaybeNullish<Member>> =>
    match(type)
      .with(
        FetchFrom.DEFAULT,
        async () => guild.members.get(memberId) ?? (await this.rest.guilds.getMember(guild.id, memberId)),
      )
      .with(FetchFrom.CACHE, () => guild.members.get(memberId))
      .with(FetchFrom.REST, async () => await this.rest.guilds.getMember(guild.id, memberId))
      .otherwise(() => undefined);

  #resolve = (path: string) => (path.split(sep).includes("dist") ? path : join(process.cwd(), path));

  #loadFiles = async (path: string | string[]) =>
    await glob(path, {
      ignore: ["node_modules/**"],
    });
}

export enum FetchFrom {
  DEFAULT,
  CACHE,
  REST,
}
