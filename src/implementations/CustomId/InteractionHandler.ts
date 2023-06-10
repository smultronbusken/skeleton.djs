import { BaseInteraction, Interaction, MessageComponentInteraction } from "discord.js";
import { Mediator } from "../../command/Mediator";
import { CustomIdCommand } from "./Command";
import { InteractionHandler } from "../../eventhandlers/InteractionHandler";
import { Skeleton } from "../../Skeleton";

/**
 * Handles all {@link MessageComponentInteraction} more specifically buttons and select menus.
 * {@link CustomIdCommand} will be executed depending on the custom id of the interaction.
 */
export default class CustomIdCommandInteractionHandler extends InteractionHandler<MessageComponentInteraction> {
  constructor(public mediator: Mediator<CustomIdCommand<any>>) {
    super();
  }

  typeGuard = (interaction: BaseInteraction): interaction is MessageComponentInteraction =>
    interaction.isMessageComponent();

  check = (interaction: MessageComponentInteraction) => {
    return this.mediator.getCommands().find(cid => cid.customId === interaction.customId);
  };

  execute = async (
    interaction: MessageComponentInteraction,
    context: any,
    skeleton: Skeleton<any>,
  ) => {
    const command = this.mediator.getCommand(interaction.customId);
    await command?.execute(interaction, context, skeleton);
  };
}
