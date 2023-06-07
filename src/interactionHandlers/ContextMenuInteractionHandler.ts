import { BaseInteraction, Collection, ContextMenuCommandInteraction, Interaction } from "discord.js";
import { InteractionHandler } from "./InteractionHandler";
import { CommandBase } from "../Command";
import { CommandMediator } from "../command/CommandMediator";
import { UserCommand } from "../command/ContextMenuCommandHandler";


export default class ContextMentInteractionHandler<T> extends InteractionHandler<ContextMenuCommandInteraction, T> {

    constructor(public mediator: CommandMediator<UserCommand<T>>) {
        super();
    }

    typeGuard = (interaction: BaseInteraction): interaction is ContextMenuCommandInteraction =>
    interaction.isContextMenuCommand()
    
    // Handle ALL context menu interactions.
    check = (interaction: ContextMenuCommandInteraction) => true

    execute = async (interaction: ContextMenuCommandInteraction, context: T) => {
        const command = this.mediator.getCommand(interaction.commandName);
        await command?.execute(interaction, context);
    }
}