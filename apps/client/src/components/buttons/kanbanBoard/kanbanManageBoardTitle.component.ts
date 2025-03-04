import { type InteractionResponse, InteractionResponseTypes, MessageComponentTypes, TextStyles } from "@discordeno/bot";
import { ButtonComponent, type ButtonComponentRunOptions } from "@structures/components/ButtonComponent.js";
import { Declare } from "@util/decorators.js";
import type { TFunction } from "i18next";

@Declare({
  customId: "@kanban_manage_board/title",
})
export default class KanbanBoardChangeTitleComponent extends ButtonComponent {
  /**
   * The method to execute when the button is pressed.
   * @param options - The available options.
   */
  async _run(options: ButtonComponentRunOptions): Promise<void> {
    const { client, context, t, values } = options;
    const { id, token } = context;
    const [boardIdFromCustomId] = values;
    const { helpers } = client;
    const interactionResponse = this.getModalInteractionResponse(t, boardIdFromCustomId);

    await helpers.sendInteractionResponse(id, token, interactionResponse);
  }

  /**
   * Gets the modal interaction response object.
   * @param t - The function to translate the command messages.
   * @param boardId - The Kanban board id.
   * @returns An object containing the modal interaction response.
   */
  getModalInteractionResponse(t: TFunction<"commands">, boardId: string): InteractionResponse {
    const interactionResponse: InteractionResponse = {
      data: {
        components: [
          {
            components: [
              {
                customId: "@kanban_manage_board/title",
                label: t(
                  "categories.utility.kanban.board.manage.message_1.components.buttons.board_title.components.modals.update_board_title.field_1.name",
                ),
                maxLength: 35,
                minLength: 3,
                required: true,
                style: TextStyles.Short,
                type: MessageComponentTypes.InputText,
                value: "isdhfids",
              },
            ],
            type: MessageComponentTypes.ActionRow,
          },
        ],
        customId: `@kanban_manage_board/title#[${boardId}]`,
        title: t(
          "categories.utility.kanban.board.manage.message_1.components.buttons.board_title.components.modals.update_board_title.title",
        ),
      },
      type: InteractionResponseTypes.Modal,
    };

    return interactionResponse;
  }
}
