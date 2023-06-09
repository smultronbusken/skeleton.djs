import {
  CommandInteraction,
  ApplicationCommandType,
  APIApplicationCommandOption,
} from "discord.js";
import { CommandBase, CommandInput } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";
import { Skeleton } from "../../main";

@Importable
export class SlashCommand<T> extends CommandBase<T> {
  constructor(
    input: Omit<CommandInput, "options">,
    execute: (interaction: CommandInteraction, context: T, skeleton: Skeleton<T>) => void,
    ...options: APIApplicationCommandOption[]
  ) {
    super(
      {
        ...input,
        id: input.id,
        version: input.version,
        default_member_permissions: input.default_member_permissions,
        type: ApplicationCommandType.ChatInput,
        application_id: "id",
        options: options,
      },
      execute,
    );
  }
}
