import {
  BaseInteraction,
  ChatInputCommandInteraction,
  Collection,
  ContextMenuCommandInteraction,
} from "discord.js";
import { CommandBase } from "./Jobs";

export interface InteractionHandler<I extends BaseInteraction> {
  typeGuard: (interaction: BaseInteraction) => interaction is I;
  check: (interaction: I) => boolean;
  execute: (
    interaction: I,
    commands: Collection<string, CommandBase<any>>,
    context: any,
  ) => Promise<void>;
}

export const chatInputCommandInteractionHandler: InteractionHandler<ChatInputCommandInteraction> = {
  typeGuard: (interaction): interaction is ChatInputCommandInteraction =>
    interaction.isChatInputCommand(),
  check: interaction => true,
  execute: async (interaction, commands, context) => {
    console.log("chat");
    let commandName = interaction.commandName;
    let subCommandName = interaction.options.getSubcommand(false);
    if (subCommandName) commandName += "/" + subCommandName;
    const command = commands.get(commandName);
    if (!command) {
      throw new Error(`Command ${commandName} not found`);
    }
    await command.execute(interaction, context);
  },
};

export const contextMenuCommandInteractionHandler: InteractionHandler<ContextMenuCommandInteraction> =
  {
    typeGuard: (interaction): interaction is ContextMenuCommandInteraction =>
      interaction.isContextMenuCommand(),
    check: interaction => true,
    execute: async (interaction, commands, context) => {
      const command = commands.get(interaction.commandName);
      console.log("context");
      if (!command) {
        throw new Error(`Command ${interaction.commandName} not found`);
      }
      await command.execute(interaction, context);
    },
  };
