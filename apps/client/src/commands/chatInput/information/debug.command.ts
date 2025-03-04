import { join } from "node:path";
import type { EmbedField } from "@discordeno/bot";
import { codeBlock } from "@discordjs/formatters";
import { createMessage } from "@functions/createMessage.js";
import { formatAnsiKeyValues } from "@functions/formatAnsiKeyValue.js";
import { ChatInputSubCommand, type ChatInputSubCommandRunOptions } from "@structures/commands/ChatInputSubCommand.js";
import { DEFAULT_EMBED_COLOR } from "@util/constants.js";
import { Declare } from "@util/decorators.js";

@Declare({
  description: "Displays bot debugging information.",
  descriptionLocalizations: {
    "es-419": "Muestra la información de depuración del bot",
    "es-ES": "Muestra la información de depuración del bot",
  },
  name: "debug",
})
export default class DebugCommand extends ChatInputSubCommand {
  /**
   * The method to execute when the command is executed.
   * @param options - The available options.
   */
  async _run(options: ChatInputSubCommandRunOptions<never>): Promise<unknown> {
    const { context, t } = options;
    const { client: botVersion, discordeno: discordenoVersion, prisma: prismaVersion } = await this.getVersions();
    const [generalInformationField, dependenciesVersionsField]: EmbedField[] = [
      {
        name: t("categories.information.debug.message_1.embeds.embed_1.field_1.name"),
        value: codeBlock(
          "ansi",
          formatAnsiKeyValues(
            t("categories.information.debug.message_1.embeds.embed_1.field_1.value", {
              botVersion,
            }),
          ),
        ),
      },
      {
        name: t("categories.information.debug.message_1.embeds.embed_1.field_2.name"),
        value: codeBlock(
          "ansi",
          formatAnsiKeyValues(
            t("categories.information.debug.message_1.embeds.embed_1.field_2.value", {
              discordenoVersion,
              prismaVersion,
            }),
          ),
        ),
      },
    ];

    return await createMessage(context, {
      embeds: [
        {
          author: {
            iconUrl: await this.getAvatarUrl(),
            name: t("categories.information.debug.message_1.embeds.embed_1.author"),
          },
          color: DEFAULT_EMBED_COLOR,
          fields: [generalInformationField, dependenciesVersionsField],
        },
      ],
    });
  }

  /**
   * Gets the package JSON file data.
   * @returns An object containing the package JSON file data.
   */
  async getPackageData(): Promise<PackageData> {
    const packagePath = join(process.cwd(), "package.json");
    const { default: packageData } = await import(`file://${packagePath}`, {
      with: {
        type: "json",
      },
    });

    return packageData;
  }

  /**
   * Gets the dependency version or the package version.
   * @param dependency - The dependency name.
   * @returns The dependency version or the package version.
   */
  async getVersion(dependency?: string): Promise<string> {
    const packageInfo = await this.getPackageData();
    const { dependencies, version } = packageInfo;

    return dependency ? dependencies[dependency] : version;
  }

  /**
   * Gets the client and the used dependencies versions.
   * @returns An object containing the client and the used dependencies versions.
   */
  async getVersions(): Promise<Versions> {
    const [client, discordeno, prisma] = await Promise.all([
      this.getVersion(),
      this.getVersion("@discordeno/bot"),
      this.getVersion("@prisma/client"),
    ]);

    return {
      client,
      discordeno,
      prisma,
    };
  }
}

interface Versions {
  /** The client version. */
  client: string;
  /** The Discordeno library version. */
  discordeno: string;
  /** The Prisma ORM version. */
  prisma: string;
}

interface PackageData {
  /** The installed dependencies from the package. */
  dependencies: Record<string, string>;
  /** The installed development dependencies from the package. */
  devDependencies: Record<string, string>;
  /** The project name. */
  name: string;
  /** The project scripts. */
  scripts: Record<string, string>;
  /** The project JavaScript type. */
  type: PackageModule;
  /** The package version. (Used as client version) */
  version: string;
}

type PackageModule = "module" | "commonjs";
