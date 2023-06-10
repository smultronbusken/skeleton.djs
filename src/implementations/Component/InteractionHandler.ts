import { BaseInteraction, Interaction, MessageComponentInteraction } from "discord.js";
import { Mediator } from "../../command/Mediator";
import { ComponentCommand } from "./Command";
import { InteractionHandler } from "../../eventhandlers/InteractionHandler";
import { Skeleton } from "../../Skeleton";

/**
 * Handles all {@link MessageComponentInteraction} more specifically buttons and select menus.
 * {@link ComponentCommand} will be executed depending on the custom id of the interaction.
 */
export default class ComponentCommandInteractionHandler extends InteractionHandler<MessageComponentInteraction> {
  constructor(public mediator: Mediator<ComponentCommand<any>>) {
    super();
  }

  typeGuard = (interaction: BaseInteraction): interaction is MessageComponentInteraction =>
    interaction.isMessageComponent();

  check = (interaction: MessageComponentInteraction) => {
    return this.mediator.getAll().find(cid => cid.customId === interaction.customId);
  };

  execute = async (
    interaction: MessageComponentInteraction,
    context: any,
    skeleton: Skeleton<any>,
  ) => {
    const command = this.mediator.get(interaction.customId);
    await command?.execute(interaction, context, skeleton);
  };
}
