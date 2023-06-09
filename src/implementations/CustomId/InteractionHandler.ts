import { BaseInteraction, Interaction, MessageComponentInteraction } from "discord.js";
import { CommandMediator } from "../../command/CommandMediator";
import { CustomIdCommand } from "./Command";
import { InteractionHandler } from "../../eventhandlers/InteractionHandler";
import { Skeleton } from "../../Skeleton";

export default class CustomIdCommandInteractionHandler extends InteractionHandler<MessageComponentInteraction> {
  constructor(public mediator: CommandMediator<CustomIdCommand<any>>) {
    super();
  }

  typeGuard = (interaction: BaseInteraction): interaction is MessageComponentInteraction =>
    interaction.isMessageComponent();

  // Do not handle subcommands
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
