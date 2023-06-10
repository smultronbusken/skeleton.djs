import { BaseInteraction, ChatInputCommandInteraction, Interaction } from "discord.js";
import { Skeleton } from "../main";

/**
 * The abstract InteractionHandler class defines a blueprint for interaction handlers.
 * Subclasses of InteractionHandler should provide implementations for `typeGuard`, `check`, and `execute`.
 *
 * @template I The type of interaction this handler will deal with. Must extend BaseInteraction.
 */
export abstract class InteractionHandler<I extends BaseInteraction> {
  /**
   * Type guard function to check if an interaction is of the correct type.
   * @abstract
   * @protected
   * @param {BaseInteraction} interaction - The interaction to check.
   * @returns {boolean} - Whether the interaction is of the correct type.
   */
  protected abstract typeGuard: (interaction: BaseInteraction) => interaction is I;

  /**
   * Check function to perform checks on the interaction.
   * @abstract
   * @protected
   * @param {I} interaction - The interaction to check.
   * @param {any} context - The context for the interaction.
   * @returns {any} - The result of the check.
   */
  protected abstract check: (interaction: I, context: any) => any;

  /**
   * Execute function to handle the interaction.
   * @abstract
   * @protected
   * @param {I} interaction - The interaction to handle.
   * @param {any} context - The context for the interaction.
   * @param {Skeleton<any>} skeleton - The Skeleton instance.
   */
  protected abstract execute: (interaction: I, context: any, skeleton: Skeleton) => void;

  /**
   * Function to perform a check using the type guard and check functions.
   * @param {BaseInteraction} interaction - The interaction to check.
   * @param {any} context - The context for the interaction.
   * @returns {any} - The result of the check if the interaction is of the correct type.
   */
  performCheck(interaction: BaseInteraction, context: any) {
    if (this.typeGuard(interaction)) {
      return this.check(interaction as I, context);
    }
  }

  /**
   * Function to perform an action using the type guard and execute functions.
   * @param {BaseInteraction} interaction - The interaction to handle.
   * @param {any} context - The context for the interaction.
   * @param {Skeleton<any>} skeleton - The Skeleton instance.
   * @returns {void} - The result of executing the action if the interaction is of the correct type.
   */
  performExecute(interaction: BaseInteraction, context: any, skeleton: Skeleton) {
    if (this.typeGuard(interaction)) {
      return this.execute(interaction as I, context, skeleton);
    }
  }
}
