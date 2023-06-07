import { BaseInteraction, ChatInputCommandInteraction, Interaction } from "discord.js";
import { CustomIdCommand, CustomIdInteraction, isCustomInteraction } from "../jobHandler/CustomIdCommandJobHandler";
import { CommandMediator } from "../command/CommandMediator";
import { InteractionHandler } from "./InteractionHandler";

export default class CustomIdCommandInteractionHandler<T> extends InteractionHandler<CustomIdInteraction, T> {

    constructor(public mediator: CommandMediator<CustomIdCommand<T>>) {
      super();
    }
    
    typeGuard = (interaction: Interaction): interaction is CustomIdInteraction => isCustomInteraction(interaction)

    // Do not handle subcommands
    check = (interaction: CustomIdInteraction) => {
      return  this.mediator.getCommands().find(cid => cid.customId === interaction.customId)
    }

    execute = async (interaction: CustomIdInteraction, context: T) => {
        const command = this.mediator.getCommand(interaction.customId);
        await command?.execute(interaction, context);
    }

}