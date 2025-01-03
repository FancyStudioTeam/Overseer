import { join, sep } from "node:path";
import { PrismaClient } from "@prisma/client";
import type {
  ButtonComponentData,
  ChatInputCommandData,
  ChatInputSubCommandData,
  MaybeNullish,
  MessageCommandData,
  ModalComponentData,
  PrefixCommandData,
  SelectMenuComponentData,
  UserCommandData,
} from "@types";
import { CommandCategory, ComponentType } from "@util/Handlers";
import { CreateLogMessageType, createLogMessage } from "@utils";
import { glob } from "glob";
import {
  ApplicationCommandTypes,
  ApplicationIntegrationTypes,
  Client,
  Collection,
  type CreateApplicationCommandOptions,
  type Guild,
  InteractionContextTypes,
  type Member,
  type User,
} from "oceanic.js";
import { match } from "ts-pattern";

const commandsArray: CreateApplicationCommandOptions[] = [];

export class Discord extends Client {
  readonly components: {
    buttons: Collection<string, ButtonComponentData>;
    modals: Collection<string, ModalComponentData>;
    selectMenus: Collection<string, SelectMenuComponentData>;
  };
  readonly interactions: {
    chatInput: Collection<string, ChatInputCommandData>;
    message: Collection<string, MessageCommandData>;
    user: Collection<string, UserCommandData>;
  };
  readonly prefixCommands: Collection<string, PrefixCommandData>;
  readonly prisma: PrismaClient;
  readonly readyAt: Date;
  readonly subCommands: Collection<string, ChatInputSubCommandData>;

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
        guilds: Number.POSITIVE_INFINITY,
        guildThreads: Number.POSITIVE_INFINITY,
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
        connectionProperties: {
          browser: "Discord Android",
        },
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

    this.components = {
      buttons: new Collection(),
      modals: new Collection(),
      selectMenus: new Collection(),
    };
    this.interactions = {
      chatInput: new Collection(),
      message: new Collection(),
      user: new Collection(),
    };
    this.prefixCommands = new Collection();
    this.prisma = new PrismaClient();
    this.readyAt = new Date();
    this.subCommands = new Collection();

    (async () => {
      await this.init();
      this.setMaxListeners(10);
    })();
  }

  async init() {
    await this.connect();
    await this.prisma
      .$connect()
      .then(() => createLogMessage("Prisma Client has been connected"))
      .catch((error) =>
        createLogMessage(error.stack ?? error.message, {
          type: CreateLogMessageType.ERROR,
        }),
      );
    await Promise.all([
      this.registerComponents(),
      this.registerPrefixCommands(),
      this.registerEvents(),
      this.registerModules(),
    ]);
  }

  async deploy() {
    await this.registerCommands();
    await this.rest.applications
      .bulkEditGlobalCommands(this.application.id, commandsArray)
      .then((commands) =>
        createLogMessage(`The interactions have been deployed | Deployed ${commands.length} interactions`),
      );
  }

  private async registerCommands() {
    this.interactions.chatInput.clear();
    this.interactions.user.clear();

    await this.registerSubCommands();
    await this.loadFiles(`${join(__dirname, "..", "commands")}/*/*/*.{ts,js}`).then((paths) => {
      for (const path of paths) {
        const commandPath = this.resolve(path);
        const command = require(commandPath).default as MaybeNullish<
          ChatInputCommandData | MessageCommandData | UserCommandData
        >;

        if (!command?.name || (command.type === ApplicationCommandTypes.USER && !command.run)) {
          throw new Error(`Path "${commandPath}" is missing a name or run function for type "${command?.type}"`);
        }

        match(command)
          .with(
            {
              type: ApplicationCommandTypes.CHAT_INPUT,
            },
            (chatInputCommandData) => this.interactions.chatInput.set(chatInputCommandData.name, chatInputCommandData),
          )
          .with(
            {
              type: ApplicationCommandTypes.MESSAGE,
            },
            (messageCommandData) => this.interactions.message.set(messageCommandData.name, messageCommandData),
          )
          .with(
            {
              type: ApplicationCommandTypes.USER,
            },
            (userCommandData) => this.interactions.user.set(userCommandData.name, userCommandData),
          );

        commandsArray.push({
          ...command,
          contexts: [InteractionContextTypes.GUILD],
          integrationTypes: [ApplicationIntegrationTypes.GUILD_INSTALL],
        });
      }
    });
  }

  private async registerComponents() {
    this.components.buttons.clear();
    this.components.selectMenus.clear();

    await this.loadFiles(`${join(__dirname, "..", "components")}/*/*/*.{ts,js}`).then((paths) => {
      for (const path of paths) {
        const componentPath = this.resolve(path);
        const component = require(componentPath).default as MaybeNullish<
          ButtonComponentData | ModalComponentData | SelectMenuComponentData
        >;

        if (!(component?.name && component?.run)) {
          throw new Error(`Path "${componentPath}" is missing a name or run function`);
        }

        match(component)
          .with(
            {
              type: ComponentType.BUTTON,
            },
            (buttonComponentData) => this.components.buttons.set(buttonComponentData.name, buttonComponentData),
          )
          .with(
            {
              type: ComponentType.MODAL,
            },
            (modalComponentData) => this.components.modals.set(modalComponentData.name, modalComponentData),
          )
          .with(
            {
              type: ComponentType.SELECT_MENU,
            },
            (selectMenuComponentData) =>
              this.components.selectMenus.set(selectMenuComponentData.name, selectMenuComponentData),
          );
      }
    });
  }

  private async registerSubCommands() {
    this.subCommands.clear();

    await this.loadFiles(`${join(__dirname, "..", "commands/chatInput")}/*/*/*.{ts,js}`).then((paths) => {
      for (const path of paths) {
        const subCommandPath = this.resolve(path);
        const subCommand = require(subCommandPath).default as MaybeNullish<ChatInputSubCommandData>;
        const categories: Record<CommandCategory, string> = {
          [CommandCategory.CONFIGURATION]: "config",
          [CommandCategory.INFORMATION]: "info",
          [CommandCategory.UTILITY]: "util",
        };

        if (!(subCommand?.name && subCommand.run)) {
          throw new Error(`Path "${subCommandPath}" is missing a name or run function`);
        }

        this.subCommands.set([categories[subCommand.category], subCommand.name].join("_"), subCommand);
      }
    });
  }

  private async registerPrefixCommands() {
    this.prefixCommands.clear();

    await this.loadFiles(`${join(__dirname, "..", "commands/prefix")}/*.{ts,js}`).then((paths) => {
      for (const path of paths) {
        const prefixCommandPath = this.resolve(path);
        const prefixCommand = require(prefixCommandPath).default as MaybeNullish<PrefixCommandData>;

        if (!(prefixCommand?.name && prefixCommand.run)) {
          throw new Error(`Path "${prefixCommandPath}" is missing a name or run function`);
        }

        this.prefixCommands.set(prefixCommand.name, prefixCommand);
      }
    });
  }

  private async registerEvents() {
    this.removeAllListeners();

    await this.loadFiles(`${join(__dirname, "..", "events")}/*/*.{ts,js}`).then((paths) => {
      for (const path of paths) {
        require(this.resolve(path));
      }
    });
  }

  private async registerModules() {
    await this.loadFiles(`${join(__dirname, "..", "modules")}/*.{ts,js}`).then((paths) => {
      for (const path of paths) {
        require(this.resolve(path)).default(this);
      }
    });
  }

  async fetchUser(
    userId: string,
    {
      type,
    }: {
      type: FetchFrom;
    } = {
      type: FetchFrom.DEFAULT,
    },
  ): Promise<MaybeNullish<User>> {
    return match(type)
      .with(FetchFrom.DEFAULT, async () => this.users.get(userId) ?? (await this.rest.users.get(userId)))
      .with(FetchFrom.CACHE, () => this.users.get(userId))
      .with(FetchFrom.REST, async () => await this.rest.users.get(userId))
      .run();
  }

  async fetchMember(
    guild: Guild,
    memberId: string,
    {
      type,
    }: {
      type: FetchFrom;
    } = {
      type: FetchFrom.DEFAULT,
    },
  ): Promise<MaybeNullish<Member>> {
    return match(type)
      .with(
        FetchFrom.DEFAULT,
        async () => guild.members.get(memberId) ?? (await this.rest.guilds.getMember(guild.id, memberId)),
      )
      .with(FetchFrom.CACHE, () => guild.members.get(memberId))
      .with(FetchFrom.REST, async () => await this.rest.guilds.getMember(guild.id, memberId))
      .run();
  }

  async isGuildMembershipActive(
    _guildId: string,
    {
      expiresAt,
      isEnabled,
    }: {
      expiresAt: MaybeNullish<Date | string>;
      isEnabled: boolean;
    },
  ) {
    const isActiveFunction = () => isEnabled && (!expiresAt || Date.now() <= Date.parse(expiresAt.toString()));
    const isActive = isActiveFunction();

    return isActive;
  }

  private resolve(path: string) {
    return path.split(sep).includes("dist") ? path : join(process.cwd(), path);
  }

  private async loadFiles(path: string | string[]) {
    return await glob(path, {
      ignore: ["node_modules"],
    });
  }
}

export enum FetchFrom {
  DEFAULT,
  CACHE,
  REST,
}
