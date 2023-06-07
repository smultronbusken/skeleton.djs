import { BaseInteraction, ChatInputCommandInteraction, Interaction } from "discord.js";
import { CommandMediator } from "../command/CommandMediator";

import { InteractionHandler } from "./InteractionHandler";
import { SlashCommand } from "../command/SlashCommandHandler";

export default class SlashCommandInteractionHandler<T> extends InteractionHandler<ChatInputCommandInteraction, T> {

    constructor(public mediator: CommandMediator<SlashCommand<T>>) {
        super();
    }

    typeGuard = (interaction: BaseInteraction): interaction is ChatInputCommandInteraction =>
    interaction.isChatInputCommand()
    
    // Do not handle subcommands
    check = (interaction: ChatInputCommandInteraction) => !interaction.options.getSubcommand(false)

    execute = async (interaction: ChatInputCommandInteraction, context: T) => {
        const command = this.mediator.getCommand(interaction.commandName);
        await command?.execute(interaction, context);
    }
}