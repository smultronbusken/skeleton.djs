import {
  BaseInteraction,
  ChatInputCommandInteraction,
  Collection,
  ContextMenuCommandInteraction,
} from "discord.js";
import { Nullable } from "discord-api-types/utils/internals";

export interface InteractionHandler<I extends BaseInteraction> {
  typeGuard: (interaction: BaseInteraction) => interaction is I;
  check: (interaction: I, context: any) => any;
  execute: (interaction: I, context: any) => Promise<void>;
}
