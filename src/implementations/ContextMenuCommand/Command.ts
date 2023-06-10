import {
  MessageContextMenuCommandInteraction,
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { CommandBase, CommandInput } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";
import { Skeleton } from "../../main";

/**
 * Class representing a message command.
 * @extends CommandBase
 */
@Importable
export class MessageCommand extends CommandBase {
  /**
   * Creates a new message command.
   * @param input Data for the command.
   * @param execute Function to execute when the command is called.
   */
  constructor(
    input: Omit<CommandInput, "description">,
    execute: (
      interaction: MessageContextMenuCommandInteraction,
      context: any,
      skeleton: Skeleton,
    ) => any,
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

/**
 * Class representing a user command.
 * @extends CommandBase
 */
@Importable
export class UserCommand extends CommandBase {
  /**
   * Creates a new user command.
   * @param input Data for the command.
   * @param execute Function to execute when the command is called.
   */
  constructor(
    input: Omit<CommandInput, "description">,
    execute: (
      interaction: UserContextMenuCommandInteraction,
      context: any,
      skeleton: Skeleton,
    ) => any,
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

/**
 * Type alias for context menu command, which can be either a user command or a message command.
 */
export type ContextMenuCommand = UserCommand | MessageCommand;
