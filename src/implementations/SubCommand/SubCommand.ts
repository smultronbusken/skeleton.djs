import {
  APIApplicationCommandBasicOption,
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandOption,
  ApplicationCommandOptionType,
  CommandInteraction,
} from "discord.js";
import { InteractionExecutable } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";
import { Skeleton } from "../../main";

// Fields from APIApplicationCommandSubcommandOption that the user should not be able to pass
export type ApplicationSubcommandNonInput = Omit<APIApplicationCommandSubcommandOption, "type">;

// Fields from APIApplicationCommandSubcommandOption that me make optional
export type ApplicationSubcommandNonInputOptional = {};

// Combine the two above
// TODO RENAME THIS INTO OPTION
export type SubcommandInput = ApplicationSubcommandNonInput & ApplicationSubcommandNonInputOptional;

export abstract class SubcommandBase<T> extends InteractionExecutable<T> {
  constructor(
    public data: APIApplicationCommandSubcommandOption,
    public execute: (interaction: any, context: T, skeleton: Skeleton<T>) => any,
  ) {
    super(execute);
  }
}

@Importable
export class SubCommand<T> extends SubcommandBase<T> {
  master: string;
  group: string;
  constructor(
    input: Omit<SubcommandInput, "options"> & { master: string; group?: string },
    execute: (interaction: CommandInteraction, context: T, skeleton: Skeleton<T>) => void,
    ...options: APIApplicationCommandBasicOption[]
  ) {
    super(
      {
        ...input,
        type: ApplicationCommandOptionType.Subcommand,
        options: options,
      },
      execute,
    );
    this.master = input.master;
    this.group = input.group;
  }
}
