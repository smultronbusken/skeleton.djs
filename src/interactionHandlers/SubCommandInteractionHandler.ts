import { BaseInteraction, ChatInputCommandInteraction, Interaction } from "discord.js";
import { CommandMediator } from "../command/CommandMediator";
import { InteractionHandler } from "./InteractionHandler";
import { SubCommand } from "../jobHandler/SubCommandJobHandler";

export default class SubCommandInteractionHandler<T> extends InteractionHandler<ChatInputCommandInteraction, T> {

    constructor(public mediator: CommandMediator<SubCommand<T>>) {
        super();
    }

    typeGuard = (interaction: BaseInteraction): interaction is ChatInputCommandInteraction =>
    interaction.isChatInputCommand()
    
    // ONLY handle subcommands
    check = (interaction: ChatInputCommandInteraction) => interaction.options.getSubcommand(false)

    execute = async (interaction: ChatInputCommandInteraction, context: T) => {
        let name = interaction.options.getSubcommand(true);
        let command = this.mediator.getCommand(interaction.commandName + "/" + name);
        await command.execute(interaction, context);
    }
} 
