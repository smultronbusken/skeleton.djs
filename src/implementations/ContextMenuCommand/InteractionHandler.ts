import { ContextMenuCommandInteraction, BaseInteraction } from "discord.js";
import { Mediator } from "../../command/Mediator";
import { InteractionHandler } from "../../eventhandlers/InteractionHandler";
import { UserCommand } from "./Command";
import { Skeleton } from "../../main";

/**
 * Handles all {@link ContextMenuCommandInteraction}.
 * ser and message commands.
 */
export default class ContextMentInteractionHandler extends InteractionHandler<ContextMenuCommandInteraction> {
  constructor(public mediator: Mediator<UserCommand<any>>) {
    super();
  }

  typeGuard = (interaction: BaseInteraction): interaction is ContextMenuCommandInteraction =>
    interaction.isContextMenuCommand();

  // Handle ALL context menu interactions.
  check = (interaction: ContextMenuCommandInteraction) => true;

  execute = async (
    interaction: ContextMenuCommandInteraction,
    context: any,
    skeleton: Skeleton<any>,
  ) => {
    const command = this.mediator.get(interaction.commandName);
    await command?.execute(interaction, context, skeleton);
  };
}
