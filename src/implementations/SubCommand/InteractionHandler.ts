import { ChatInputCommandInteraction, BaseInteraction } from "discord.js";
import { CommandMediator } from "../../command/CommandMediator";
import { SubCommand } from "./SubCommand";
import { InteractionHandler } from "../../eventhandlers/InteractionHandler";

export default class SubCommandInteractionHandler extends InteractionHandler<ChatInputCommandInteraction> {
  constructor(public mediator: CommandMediator<SubCommand<any>>) {
    super();
  }

  typeGuard = (interaction: BaseInteraction): interaction is ChatInputCommandInteraction =>
    interaction.isChatInputCommand();

  // ONLY handle subcommands
  check = (interaction: ChatInputCommandInteraction) => interaction.options.getSubcommand(false);

  execute = async (interaction: ChatInputCommandInteraction, context: any) => {
    let name = interaction.options.getSubcommand(true);
    let command = this.mediator.getCommand(interaction.commandName + "/" + name);
    await command.execute(interaction, context);
  };
}
