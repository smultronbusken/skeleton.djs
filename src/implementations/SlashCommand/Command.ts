import { CommandInteraction, ApplicationCommandType } from "discord.js";
import { CommandBase, CommandInput } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";

@Importable
export class SlashCommand<T> extends CommandBase<T> {
  constructor(input: CommandInput, execute: (interaction: CommandInteraction, context: T) => void) {
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
