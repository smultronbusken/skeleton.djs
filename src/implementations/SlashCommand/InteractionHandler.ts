import { ChatInputCommandInteraction, BaseInteraction } from "discord.js";
import { CommandMediator } from "../../command/CommandMediator";
import { InteractionHandler } from "../../eventhandlers/InteractionHandler";
import { SlashCommand } from "./Command";
import { Skeleton } from "../../main";

export default class SlashCommandInteractionHandler extends InteractionHandler<ChatInputCommandInteraction> {
  constructor(public mediator: CommandMediator<SlashCommand<any>>) {
    super();
  }

  typeGuard = (interaction: BaseInteraction): interaction is ChatInputCommandInteraction =>
    interaction.isChatInputCommand();

  // Do not handle subcommands
  check = (interaction: ChatInputCommandInteraction) => !interaction.options.getSubcommand(false);

  execute = async (interaction: ChatInputCommandInteraction, context: any, skeleton: Skeleton<any>) => {
    const command = this.mediator.getCommand(interaction.commandName);
    await command?.execute(interaction, context, skeleton);
  };
}
