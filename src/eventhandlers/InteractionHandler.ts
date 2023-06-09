import { BaseInteraction, ChatInputCommandInteraction, Interaction } from "discord.js";
import { Skeleton } from "../main";

export abstract class InteractionHandler<I extends BaseInteraction> {
  protected abstract typeGuard: (interaction: BaseInteraction) => interaction is I;
  protected abstract check: (interaction: I, context: any) => any;
  protected abstract execute: (interaction: I, context: any, skeleton: Skeleton<any>) => void;

  performCheck(interaction: BaseInteraction, context: any) {
    if (this.typeGuard(interaction)) {
      return this.check(interaction as I, context);
    }
  }

  performExecute(interaction: BaseInteraction, context: any, skeleton: Skeleton<any>) {
    if (this.typeGuard(interaction)) {
      return this.execute(interaction as I, context, skeleton);
    }
  }
}
