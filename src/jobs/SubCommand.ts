import {
  Collection,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  APIApplicationCommandSubcommandGroupOption,
  CommandInteraction,
} from "discord.js";
import { JobRegister } from "../Jobs";
import { InteractionHandler } from "../interactions/InteractionHandler";
import { CommandInput, SubcommandBase, SubcommandInput } from "./Command";
import { SlashCommand } from "./SlashCommand";

export class SubcommandHandler<T> {
  private subCommands: Collection<string, SubCommand<T>> = new Collection();
  private masterCommands: Collection<string, MasterCommand<T>> = new Collection();

  handler: InteractionHandler<ChatInputCommandInteraction> = {
    typeGuard: (interaction): interaction is ChatInputCommandInteraction =>
      interaction.isChatInputCommand(),
    check: interaction => interaction.options.getSubcommand(true),
    execute: async (interaction, context) => {
      let name = interaction.options.getSubcommand(true);
      let command = this.subCommands.get(interaction.commandName + "/" + name);
      await command.execute(interaction, context);
    },
  };

  onRegisterSub = {
    type: SubCommand,
    func: (job: SubCommand<T>) => {
      this.subCommands.set(job.master + "/" + job.data.name, job);
    },
  };

  onRegisterMaster = {
    type: MasterCommand,
    func: (job: MasterCommand<T>) => {
      this.masterCommands.set(job.data.name, job);
    },
  };

  convertCommandsToJSON() {
    const commandsAsJson = [];
    for (const c of this.masterCommands.values()) {
      let options = [];
      // Find all direct subcommads
      let subCommands = this.subCommands.filter(sc => sc.master === c.data.name);
      subCommands.forEach(sc => {
        if (sc.group) {
          let groupOption = c.data.options.find(option => {
            return (
              option.type === ApplicationCommandOptionType.SubcommandGroup &&
              option.name == sc.group
            );
          }) as APIApplicationCommandSubcommandGroupOption;

          if (!groupOption) throw new Error(`Subcommand group ${sc.group} does not exist.`);

          if (!groupOption.options) groupOption.options = [];
          groupOption.options.push(sc.data);
        } else {
          options.push(sc.data);
        }
      });

      commandsAsJson.push({
        ...c.data,
        options: c.data.options.concat(options),
      });
    }
    return commandsAsJson;
  }
}

@JobRegister.JobClass
export class MasterCommand<T> extends SlashCommand<T> {
  constructor(input: CommandInput) {
    super(input, () => {});
  }
}

@JobRegister.JobClass
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
