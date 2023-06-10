import { ChatInputCommandInteraction, BaseInteraction } from "discord.js";
import { Mediator } from "../../command/Mediator";
import { SubCommand } from "./SubCommand";
import { InteractionHandler } from "../../eventhandlers/InteractionHandler";
import { Skeleton } from "../../main";

/**
 * Handles all {@link ChatInputCommandInteraction}s which also have a subcommand option.
 * These get mapped to the correct {@link SubCommand} which are then executed.
 */
export default class SubCommandInteractionHandler extends InteractionHandler<ChatInputCommandInteraction> {
  constructor(public mediator: Mediator<SubCommand<any>>) {
    super();
  }

  typeGuard = (interaction: BaseInteraction): interaction is ChatInputCommandInteraction =>
    interaction.isChatInputCommand();

  /**
   * Checks if the interaction is a sub-command.
   */
  check = (interaction: ChatInputCommandInteraction) => interaction.options.getSubcommand(false);

  execute = async (
    interaction: ChatInputCommandInteraction,
    context: any,
    skeleton: Skeleton<any>,
  ) => {
    let name = interaction.options.getSubcommand(true);
    let command = this.mediator.get(interaction.commandName + "/" + name);
    await command.execute(interaction, context, skeleton);
  };
}
