import {
  MessageContextMenuCommandInteraction,
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { CommandBase, CommandInput } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";
import { Skeleton } from "../../main";

@Importable
export class MessageCommand<T> extends CommandBase<T> {
  constructor(
    input: Omit<CommandInput, "description">,
    execute: (interaction: MessageContextMenuCommandInteraction, context: T, skeleton: Skeleton<T>) => any,
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
    execute: (interaction: UserContextMenuCommandInteraction, context: T, skeleton: Skeleton<T>) => any,
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
