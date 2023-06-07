import {
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Collection,
  CommandInteraction,
} from "discord.js";
import { InteractionHandler } from "../interactions/InteractionHandler";
import {} from "@discordjs/builders";
import { JobRegister } from "../Jobs";
import { CommandBase, CommandInput, SubcommandBase, SubcommandInput } from "./Command";

export class SlashCommandHandler<T> {
  private commands: Collection<string, SlashCommand<T>> = new Collection();

  handler: InteractionHandler<ChatInputCommandInteraction> = {
    typeGuard: (interaction): interaction is ChatInputCommandInteraction =>
      interaction.isChatInputCommand(),
    check: interaction => !interaction.options.getSubcommand(false),
    execute: async (interaction, context) => {
      const command = this.commands.get(interaction.commandName);
      await command.execute(interaction, context);
    },
  };

  onRegister = {
    type: SlashCommand,
    func: (job: SlashCommand<T>) => {
      this.commands.set(job.data.name, job);
    },
  };

  convertCommandsToJSON() {
    const commandsAsJson = [];
    for (const c of this.commands.values()) {
      commandsAsJson.push({
        ...c.data,
      });
    }
    return commandsAsJson;
  }
}

@JobRegister.JobClass
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
