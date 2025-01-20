import { join } from "node:path";
import { ApplicationCommandOptionTypes, type EmbedField } from "@discordeno/bot";
import { codeBlock } from "@discordjs/formatters";
import { createMessage } from "@functions/createMessage.js";
import { formatAnsiKeyValues } from "@functions/formatAnsiKeyValue.js";
import { ChatInputSubCommand, type ChatInputSubCommandRunOptions } from "@structures/commands/ChatInputSubCommand.js";
import { DEFAULT_EMBED_COLOR } from "@util/constants.js";

export default class DebugCommand extends ChatInputSubCommand {
  constructor() {
    super({
      description: "Displays bot debugging information.",
      name: "debug",
      type: ApplicationCommandOptionTypes.SubCommand,
    });
  }

  async run({ context, t }: ChatInputSubCommandRunOptions): Promise<void> {
    const { bot: botVersion, discordeno: discordenoVersion, prisma: prismaVersion } = await this.getAllVersions();
    const [generalInformationField, dependenciesVersionsField]: EmbedField[] = [
      {
        name: t("categories.information.debug.message_1.embed.field_1.name"),
        value: codeBlock(
          "ansi",
          formatAnsiKeyValues(
            t("categories.information.debug.message_1.embed.field_1.value", {
              botVersion,
            }),
          ),
        ),
      },
      {
        name: t("categories.information.debug.message_1.embed.field_2.name"),
        value: codeBlock(
          "ansi",
          formatAnsiKeyValues(
            t("categories.information.debug.message_1.embed.field_2.value", {
              discordenoVersion,
              prismaVersion,
            }),
          ),
        ),
      },
    ];

    await createMessage(context, {
      embeds: [
        {
          author: {
            iconUrl: await this.getAvatarUrl(),
            name: t("categories.information.debug.message_1.embed.author"),
          },
          color: DEFAULT_EMBED_COLOR,
          fields: [generalInformationField, dependenciesVersionsField],
        },
      ],
    });
  }

  /**
   * Gets the dependencies versions.
   * @returns The dependencies versions.
   */
  async getAllVersions(): Promise<AllVersions> {
    const [bot, discordeno, prisma] = await Promise.all([
      this.getVersion(),
      this.getVersion("@discordeno/bot"),
      this.getVersion("@prisma/client"),
    ]);

    return {
      bot,
      discordeno,
      prisma,
    };
  }

  /**
   * Gets the dependency version (if provided) or the package version.
   * @param dependency The dependency name.
   * @returns The dependency version (if provided) or the package version.
   */
  async getVersion(dependency?: string): Promise<string> {
    const packageInfo = await this.getPackage();
    const { dependencies, version } = packageInfo;

    return dependency ? dependencies[dependency] : version;
  }

  /**
   * Gets the package JSON file data.
   * @returns The package JSON file data.
   */
  async getPackage(): Promise<Package> {
    const packagePath = join(process.cwd(), "package.json");
    const packageImport = await import(`file://${packagePath}`, {
      with: {
        type: "json",
      },
    });

    /**
     * Dynamic JSON imports are imported using default exports.
     */
    return packageImport.default;
  }
}

interface AllVersions {
  /*
   * The bot version.
   */
  bot: string;
  /**
   * The Discordeno library version.
   */
  discordeno: string;
  /**
   * The Prisma ORM version.
   */
  prisma: string;
}

interface Package {
  /**
   * The installed dependencies from the package.
   */
  dependencies: Record<string, string>;
  /**
   * The installed development dependencies from the package.
   */
  devDependencies: Record<string, string>;
  /**
   * The package version. (Used as client version)
   */
  version: string;
}
