import { ModalSubmitInteraction, Collection, BaseInteraction } from "discord.js";
import { InteractionHandler } from "../../eventhandlers/InteractionHandler";
import { Skeleton } from "../../Skeleton";

export default class ModalInteractionHandler extends InteractionHandler<ModalSubmitInteraction> {
  
    customIds: Collection<string, (interaction: ModalSubmitInteraction) => any> = new Collection()

    typeGuard = (interaction: BaseInteraction): interaction is ModalSubmitInteraction =>
      interaction.isModalSubmit();
  
    check = (interaction: ModalSubmitInteraction) => {
        console.log(this.customIds)
      return this.customIds.get(interaction.customId)
    };
  
    execute = async (interaction: ModalSubmitInteraction, context: any, skeleton: Skeleton<any>) => {
      await this.customIds.get(interaction.customId)(interaction);
      this.customIds.delete(interaction.customId)
    }; 

    handleModalSubmit(customId: string, func: ModalSubmitCommand) {
        this.customIds.set(customId, func)
    }

  }

export type ModalSubmitCommand = (interaction: ModalSubmitInteraction) => any
  