import {
  APIApplicationCommandBasicOption,
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandOption,
  ApplicationCommandOptionType,
  CommandInteraction,
} from "discord.js";
import { InteractionExecutableContainer } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";
import { Skeleton } from "../../Skeleton";
import { InteractionExecutable } from "../../main";

/**
 * An abstract class representing a base for a subcommand.
 */
export abstract class SubcommandBase<T> extends InteractionExecutableContainer<T> {
  /**
   * Constructs a new SubcommandBase.
   * @param data - APIApplicationCommandSubcommandOption data for the subcommand.
   * @param execute - Function to execute when the subcommand is called.
   */
  constructor(
    public data: APIApplicationCommandSubcommandOption,
    public execute: (interaction: any, context: T, skeleton: Skeleton<T>) => any,
  ) {
    super(execute);
  }
}

/**
 * A class representing a subcommand. . Use in combination with `MasterCommand`-
 @example
 ```ts
  new SubCommand<{}>(
    {
      master: "mastercommandname",
      group: "group",
      name: "subcommand",
      description: "foobar",
    },
    async (interaction, app) => {
      interaction.reply("Hi.");
    },
  );
 ```
 */
@Importable
export class SubCommand<T> extends SubcommandBase<T> {
  /**
   * Name of the master command.
   */
  master: string;

  /**
   * Name of the command group.
   */
  group: string;

  /**
   * @param input - Data for the subcommand, a master command name, and optionally, a command group name can be set.
   * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure}
   * @remarks the mastercommand name must refer to a {@link MasterCommand} with the same name.
   * @param execute - Function to execute when the subcommand is called.
   * @param options - Array of basic command options.
   */
  constructor(
    input: Omit<APIApplicationCommandSubcommandOption, "type" | "options"> & {
      master: string;
      group?: string;
    },
    execute: InteractionExecutable<T>,
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
