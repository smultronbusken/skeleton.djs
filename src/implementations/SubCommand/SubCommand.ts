import {
  APIApplicationCommandSubcommandOption,
  ApplicationCommandOptionType,
  CommandInteraction,
} from "discord.js";
import { InteractionExecutable } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";

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
    public execute: (interaction: any, context: T) => any,
  ) {
    super(execute);
  }
}

@Importable
export class SubCommand<T> extends SubcommandBase<T> {
  master: string;
  group: string;
  constructor(
    input: SubcommandInput & { master: string; group?: string },
    execute: (interaction: CommandInteraction, context: T) => void,
  ) {
    super(
      {
        ...input,
        type: ApplicationCommandOptionType.Subcommand,
      },
      execute,
    );
    this.master = input.master;
    this.group = input.group;
  }
}
