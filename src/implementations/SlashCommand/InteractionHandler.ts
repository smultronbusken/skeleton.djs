import { ChatInputCommandInteraction, BaseInteraction } from "discord.js";
import { Mediator } from "../../command/Mediator";
import { InteractionHandler } from "../../eventhandlers/InteractionHandler";
import { SlashCommand } from "./Command";
import { Skeleton } from "../../main";

/**
 * Handles all {@link ChatInputCommandInteraction}s which does NOT have a subcommand option.
 * These get mapped to the correct {@link SlashCommand} which are then executed.
 */
export default class SlashCommandInteractionHandler extends InteractionHandler<ChatInputCommandInteraction> {
  constructor(public mediator: Mediator<SlashCommand>) {
    super();
  }

  typeGuard = (interaction: BaseInteraction): interaction is ChatInputCommandInteraction =>
    interaction.isChatInputCommand();

  /**
   * Checks if the interaction is a not a subcommand.
   */
  check = (interaction: ChatInputCommandInteraction) => !interaction.options.getSubcommand(false);

  execute = async (interaction: ChatInputCommandInteraction, context: any, skeleton: Skeleton) => {
    const command = this.mediator.get(interaction.commandName);
    await command?.execute(interaction, context, skeleton);
  };
}
