import { ContextMenuCommandInteraction, BaseInteraction } from "discord.js";
import { CommandMediator } from "../../command/CommandMediator";
import { InteractionHandler } from "../../eventhandlers/InteractionHandler";
import { UserCommand } from "./Command";
import { Skeleton } from "../../main";

export default class ContextMentInteractionHandler extends InteractionHandler<ContextMenuCommandInteraction> {
  constructor(public mediator: CommandMediator<UserCommand<any>>) {
    super();
  }

  typeGuard = (interaction: BaseInteraction): interaction is ContextMenuCommandInteraction =>
    interaction.isContextMenuCommand();

  // Handle ALL context menu interactions.
  check = (interaction: ContextMenuCommandInteraction) => true;

  execute = async (interaction: ContextMenuCommandInteraction, context: any, skeleton: Skeleton<any>) => {
    const command = this.mediator.getCommand(interaction.commandName);
    await command?.execute(interaction, context, skeleton);
  };
}
