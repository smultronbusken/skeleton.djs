import {
  CommandInteraction,
  ApplicationCommandType,
  APIApplicationCommandOption,
} from "discord.js";
import { CommandBase, CommandInput } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";
import { Skeleton } from "../../main";

/**
 * Represents a slash command.
 * @example
 ```ts
    new SlashCommand({
      name: "user",
    },
    async (interaction) => {
      interaction.reply("Hi.");
    },
  );
 ```
 */
@Importable
export class SlashCommand extends CommandBase {
  /**
   * @param input - Data for the command
   * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object}.
   * @param execute - Function to execute when the subcommand is called.
   * @param options - Array of basic command options.
   */
  constructor(
    input: Omit<CommandInput, "options">,
    execute: (interaction: CommandInteraction, context: any, skeleton: Skeleton) => void,
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
