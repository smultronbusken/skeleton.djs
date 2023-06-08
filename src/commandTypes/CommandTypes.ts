
import { APIApplicationCommand, APIApplicationCommandSubcommandOption, ApplicationCommandOptionType, ApplicationCommandType, CommandInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import { Importable } from "../Importer";

export class Executable<T> {
  constructor(public execute: (interaction: any, app: T) => any) {}
}


// Fields from APIApplicationCommandSubcommandOption that the user should not be able to pass
export type ApplicationSubcommandNonInput = Omit<APIApplicationCommandSubcommandOption, "type">;

// Fields from APIApplicationCommandSubcommandOption that me make optional
export type ApplicationSubcommandNonInputOptional = {};

// Combine the two above
export type SubcommandInput = ApplicationSubcommandNonInput & ApplicationSubcommandNonInputOptional;

export abstract class SubcommandBase<T> extends Executable<T> {
  constructor(
    public data: APIApplicationCommandSubcommandOption,
    public execute: (interaction: any, app: T) => any,
  ) {
    super(execute);
  }
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

export abstract class CommandBase<T> extends Executable<T> {
  constructor(
    public data: APIApplicationCommand,
    public execute: (interaction: any, app: T) => any,
  ) {
    super(execute);
  }
}


@Importable
export class SlashCommand<T> extends CommandBase<T> {
  constructor(input: CommandInput, execute: (interaction: CommandInteraction, app: T) => void) {
    super(
      {
        ...input,
        id: input.id,
        version: input.version,
        default_member_permissions: input.default_member_permissions,
        type: ApplicationCommandType.ChatInput,
        application_id: "id",
      },
      execute,
    );
  }
}

@Importable
export class SubCommand<T> extends SubcommandBase<T> {
  master: string;
  group: string;
  constructor(
    input: SubcommandInput & { master: string; group?: string },
    execute: (interaction: CommandInteraction, app: T) => void,
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

@Importable
export class MasterCommand<T> extends SlashCommand<T> {
  constructor(input: CommandInput) {
    super(input, () => {});
  }
}


@Importable
export class MessageCommand<T> extends CommandBase<T> {
  constructor(
    input: Omit<CommandInput, "description">,
    execute: (interaction: MessageContextMenuCommandInteraction, app: T) => any,
  ) {
    super(
      {
        ...input,
        id: input.id,
        version: input.version,
        default_member_permissions: input.default_member_permissions,
        type: ApplicationCommandType.Message,
        application_id: "id",
        description: undefined,
      },
      execute,
    );
  }
}

@Importable
export class UserCommand<T> extends CommandBase<T> {
  constructor(
    input: Omit<CommandInput, "description">,
    execute: (interaction: UserContextMenuCommandInteraction, app: T) => any,
  ) {
    super(
      {
        ...input,
        id: input.id,
        version: input.version,
        default_member_permissions: input.default_member_permissions,
        type: ApplicationCommandType.User,
        application_id: "id",
        description: undefined,
      },
      execute,
    );
  }
}

export type ContextMenuCommand<T> = UserCommand<T> | MessageCommand<T>;
