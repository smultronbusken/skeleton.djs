import {
  BaseInteraction, ChatInputCommandInteraction, Interaction,
} from "discord.js";

export abstract class InteractionHandler<I extends BaseInteraction, T> {
  protected abstract typeGuard: (interaction: BaseInteraction) => interaction is I; 
  protected abstract check: (interaction: I, context: T) => any;
  protected abstract execute: (interaction: I, context: T) => void;
  
  performCheck(interaction: BaseInteraction, context: T) {
    if (this.typeGuard(interaction)) {
      return this.check(interaction as I, context)
    }
  }

  performExecute(interaction: BaseInteraction, context: T) {
    if (this.typeGuard(interaction)) {
      return this.execute(interaction as I, context)
    }
  }

}

