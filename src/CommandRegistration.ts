import {
  SlashCommandStringOption,
  SlashCommandIntegerOption,
  SlashCommandSubcommandBuilder,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  ApplicationCommandOptionBase,
} from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import {
  CommandBase,
  CommandOption,
  SlashCommandBase,
  CommandOptionType,
  CommandType,
  SubCommand,
} from "./Jobs";
import { Collection } from "discord.js";

export async function registerCommands(
  JSONCommands: string[],
  token: string,
  clientId: string,
  guildId?: string,
  debug?: boolean,
) {
  if (debug) console.log("Setting up " + JSONCommands.length + " commands for slash commands.");
  const rest = new REST({ version: "9" }).setToken(token);
  try {
    if (debug) console.log("Started refreshing application (/) commands.");
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: JSONCommands,
      });
    } else {
      await rest.put(Routes.applicationCommands(clientId), {
        body: JSONCommands,
      });
    }

    if (debug) console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

export function convertCommandsToJson<T>(
  commands: Collection<string, CommandBase<T>>,
  subCommands: Array<SubCommand<T>>,
): string[] {
  const commandsAsJson = [];

  let createOption = <T extends ApplicationCommandOptionBase>(
    optionBuilder: T,
    option: CommandOption,
  ): T => {
    optionBuilder.setName(option.name).setDescription(option.description);
    if (option.required) optionBuilder.setRequired(option.required);

    if (optionBuilder instanceof SlashCommandStringOption) {
      if (option.choices) {
        option.choices.forEach(choice => optionBuilder.addChoices(choice));
      }
    }

    if (optionBuilder instanceof SlashCommandIntegerOption) {
      if (option.choices) {
        option.choices.forEach(choice => optionBuilder.addChoices(choice));
      }
    }

    return optionBuilder;
  };

  let addOptions = <K extends SlashCommandSubcommandBuilder | SlashCommandBuilder>(
    command: SlashCommandBase<any>,
    commandBuilder: K,
  ) => {
    let options = command.options;
    if (options) {
      options.forEach(option => {
        switch (option.type) {
          case CommandOptionType.Boolean:
            commandBuilder.addBooleanOption(optionBuilder => createOption(optionBuilder, option));
            break;
          case CommandOptionType.Channel:
            commandBuilder.addChannelOption(optionBuilder => createOption(optionBuilder, option));
            break;
          case CommandOptionType.Integer:
            commandBuilder.addIntegerOption(optionBuilder => createOption(optionBuilder, option));
            break;
          case CommandOptionType.Mentionable:
            commandBuilder.addMentionableOption(optionBuilder =>
              createOption(optionBuilder, option),
            );
            break;
          case CommandOptionType.Number:
            commandBuilder.addNumberOption(optionBuilder => createOption(optionBuilder, option));
            break;
          case CommandOptionType.Role:
            commandBuilder.addRoleOption(optionBuilder => createOption(optionBuilder, option));
            break;
          case CommandOptionType.String:
            commandBuilder.addStringOption(optionBuilder => createOption(optionBuilder, option));
            break;
          case CommandOptionType.User:
            commandBuilder.addBooleanOption(optionBuilder => createOption(optionBuilder, option));
            break;
        }
      });
    }
    return commandBuilder;
  };

  commands.forEach(command => {
    if (command.type === CommandType.Message || command.type === CommandType.User) {
      commandsAsJson.push(command);
      return;
    }

    let slashCommand = new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.info ? command.info : "-");

    addOptions(command, slashCommand);

    let correctSubCommands = subCommands.filter(
      subCommand => subCommand.masterCommand == command.name,
    );
    correctSubCommands.forEach(subCommand => {
      slashCommand.addSubcommand(s => {
        s.setName(subCommand.name).setDescription(subCommand.info);
        return addOptions(subCommand, s);
      });
    });
    let json = slashCommand.toJSON();

    //json["type"] = command.type;

    commandsAsJson.push(json);
  });

  return commandsAsJson;
}
