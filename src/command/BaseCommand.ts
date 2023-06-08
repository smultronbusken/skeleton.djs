import {
  APIApplicationCommand,
  APIApplicationCommandSubcommandOption,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  CommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { Importable } from "../importer/Importer";

export class InteractionExecutable<T> {
  constructor(public execute: (interaction: any, context: T) => any) {}
}

// Fields from APIApplicationCommandSubcommandOption that the user should not be able to pass
export type ApplicationCommandNonInput = Omit<
  APIApplicationCommand,
  "id" | "version" | "type" | "application_id" | "default_member_permissions"
>;

// Fields from APIApplicationCommandSubcommandOption that me make optional
export type ApplicationCommandNonInputOptional = {
  id?: string;
  version?: string;
  default_member_permissions?: string;
};

// Combine the two above
export type CommandInput = ApplicationCommandNonInput & ApplicationCommandNonInputOptional;

export abstract class CommandBase<T> extends InteractionExecutable<T> {
  constructor(
    public data: APIApplicationCommand,
    public execute: (interaction: any, context: T) => any,
  ) {
    super(execute);
  }
}
