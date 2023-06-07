import {
  APIApplicationCommand,
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandOption,
  ApplicationCommandOption,
} from "discord.js";
import { Job } from "../Jobs";
import { APIApplicationCommandSubcommandGroupOption } from "discord-api-types/v9";

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

export abstract class CommandBase<T> extends Job<T> {
  constructor(
    public data: APIApplicationCommand,
    public execute: (interaction: any, app: T) => any,
  ) {
    super(execute);
  }
}

// Fields from APIApplicationCommandSubcommandOption that the user should not be able to pass
export type ApplicationSubcommandNonInput = Omit<APIApplicationCommandSubcommandOption, "type">;

// Fields from APIApplicationCommandSubcommandOption that me make optional
export type ApplicationSubcommandNonInputOptional = {};

// Combine the two above
export type SubcommandInput = ApplicationSubcommandNonInput & ApplicationSubcommandNonInputOptional;

export abstract class SubcommandBase<T> extends Job<T> {
  constructor(
    public data: APIApplicationCommandSubcommandOption,
    public execute: (interaction: any, app: T) => any,
  ) {
    super(execute);
  }
}
