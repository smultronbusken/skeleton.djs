import { ContextMenuCommandInteraction, BaseInteraction } from "discord.js";
import { CommandMediator } from "../commandHandlers/CommandMediator";
import { UserCommand } from "../commandTypes/CommandTypes";
import { InteractionHandler } from "./InteractionHandler";

export default class ContextMentInteractionHandler<T> extends InteractionHandler<
  ContextMenuCommandInteraction,
  T
> {
  constructor(public mediator: CommandMediator<UserCommand<T>>) {
    super();
  }

  typeGuard = (interaction: BaseInteraction): interaction is ContextMenuCommandInteraction =>
    interaction.isContextMenuCommand();

  // Handle ALL context menu interactions.
  check = (interaction: ContextMenuCommandInteraction) => true;

  execute = async (interaction: ContextMenuCommandInteraction, context: T) => {
    const command = this.mediator.getCommand(interaction.commandName);
    await command?.execute(interaction, context);
  };
}
