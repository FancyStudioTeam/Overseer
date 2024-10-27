import { client } from "@index";
import { Embed, EmbedField } from "oceanic-builders";
import type { CreateMessageOptions, Message } from "oceanic.js";
import { match } from "ts-pattern";
import type { YAMLCordFunction, YAMLCordVariables } from "yamlcord";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const replaceVariables = async (content: string, message: Message) => {
  if (!(message.inCachedGuildChannel() && message.guild)) {
    return content;
  }

  let newContent = content;
  const owner = await client.fetchUser(message.guild.ownerID ?? "");
  const variablesMap: Record<YAMLCordVariables, string | number> = {
    "[date_now]": Date.now(),
    "[guild_id]": message.guildID,
    "[guild_name]": message.guild.name,
    "[message_content]": message.content,
    "[owner_id]": owner?.id ?? "",
    "[owner_name]": owner?.name ?? "",
    "[user_id]": message.author.id,
    "[user_name]": message.author.name,
  };

  for (const [key, value] of Object.entries(variablesMap)) {
    newContent = newContent.replaceAll(key, String(value));
  }

  return newContent;
};
export const executeFunction = (
  yamlCordFunction: YAMLCordFunction,
  {
    message,
  }: {
    message: Message;
  },
) => {
  if (!(message.inCachedGuildChannel() && message.guild)) return;

  match(yamlCordFunction)
    .with(
      {
        name: "add_reaction",
      },
      async ({ data }) => {
        for (const emoji of data) {
          await delay(1000);
          await client.rest.channels.createReaction(message.channelID, message.id, emoji);
        }
      },
    )
    .with(
      {
        name: "create_message",
      },
      async ({ data }) => {
        let channelId = message.channelID;
        const messagePayload: CreateMessageOptions = {
          content: await replaceVariables(data.content, message),
        };

        if (data.channel_id) {
          const channel = message.guild?.channels.get(data.channel_id);

          if (channel) {
            channelId = channel.id;
          }
        }

        if (data.reply) {
          messagePayload.messageReference = {
            messageID: message.id,
            failIfNotExists: false,
          };
          messagePayload.allowedMentions = {
            repliedUser: data.reply === "ping",
          };
        }

        if (data.embeds) {
          const embeds = data.embeds.map(async (rawEmbed) => {
            const embed = new Embed();

            if (rawEmbed.author) {
              const { name, icon_url, url } = rawEmbed.author;

              embed.setAuthor({
                name: await replaceVariables(name, message),
                iconURL: icon_url,
                url,
              });
            }

            if (rawEmbed.color) {
              embed.setColor(rawEmbed.color);
            }

            if (rawEmbed.description) {
              embed.setDescription(await replaceVariables(rawEmbed.description, message));
            }

            if (rawEmbed.fields) {
              const fields: EmbedField[] = [];

              for (const rawField of rawEmbed.fields) {
                const { name, inline, value } = rawField;

                fields.push(
                  new EmbedField()
                    .setName(await replaceVariables(name, message))
                    .setValue(await replaceVariables(value, message))
                    .setInline(!!inline),
                );
              }

              embed.addFields(fields);
            }

            if (rawEmbed.footer) {
              const { text, icon_url } = rawEmbed.footer;

              embed.setFooter({
                text: await replaceVariables(text, message),
                iconURL: icon_url,
              });
            }

            if (rawEmbed.image) {
              embed.setImage(rawEmbed.image.url);
            }

            if (rawEmbed.thumbnail) {
              embed.setThumbnail(rawEmbed.thumbnail.url);
            }

            if (rawEmbed.timestamp) {
              embed.setTimestamp();
            }

            if (rawEmbed.title) {
              embed.setTitle(await replaceVariables(rawEmbed.title, message));
            }

            if (rawEmbed.url) {
              embed.setURL(rawEmbed.url);
            }

            return embed.toJSON();
          });

          messagePayload.embeds = await Promise.all(embeds);
        }

        await client.rest.channels.createMessage(channelId, messagePayload);
      },
    )
    .with(
      {
        name: "wait",
      },
      async ({ data }) => delay(data),
    );
};
