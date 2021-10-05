import {
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { SlashCommandOptionBase } from "@discordjs/builders/dist/interactions/slashCommands/mixins/CommandOptionBase";
import { REST } from "@discordjs/rest";
import { Routes, Snowflake } from "discord-api-types/v9";
import { Client, ClientOptions, Collection } from "discord.js";
import StormDB from "stormdb";
import { EventEmitter } from "stream";
import JobRegister, {
  CommandBase,
  CommandOption,
  CommandOptionType,
  CommandType,
  MessageCommand,
  SlashCommand,
  SlashCommandBase,
  SubCommand,
  UserCommand,
} from "./Jobs";
import StorageImporter from "./StorageImporter";

export default class Skeleton<T> {
  public commands: Collection<string, CommandBase<T>> = new Collection();
  public subCommands: Array<SubCommand<T>> = new Array();
  public storages: Collection<any, StormDB> = new Collection();
  public client: Client;
  private emitter: EventEmitter = new EventEmitter();
  public jobRegister: JobRegister;

  constructor(
    public app: T,
    private token: string,
    private clientId: string,
    clientOptions: ClientOptions,
    private guildId?: Snowflake,
  ) {
    this.client = new Client(clientOptions);
    this.client.on("interactionCreate", async interaction => {
      if (interaction.isCommand()) {
        let subCommandName = interaction.options.getSubcommand(false);
        if (subCommandName) {
          let subCommand = this.subCommands.find(
            subCommand =>
              subCommand.masterCommand === interaction.commandName &&
              subCommand.name === subCommandName,
          );
          if (subCommand) subCommand.execute(interaction, app);
        } else {
          this.commands.get(interaction.commandName).execute(interaction, app);
        }
      }
      if (interaction.isContextMenu()) {
        this.commands.get(interaction.commandName).execute(interaction, app);
      }
    });
    this.init();
  }

  on(event: string, fn: (...args: any) => any) {
    this.emitter.on(event, fn);
  }

  addStorage(db: StormDB) {
    this.storages.set(db.get("name").value(), db);
  }

  getStorage(dbName: string): StormDB {
    return this.storages.get(dbName);
  }

  async init() {
    await this.importStorages();
    await this.importJobs(), await this.setUpSlashCommands(), this.emitter.emit("ready");
  }

  async importJobs() {
    this.jobRegister = new JobRegister();

    this.jobRegister.onRegister(SlashCommand, command => {
      this.commands.set(command.name, command);
    });

    this.jobRegister.onRegister(UserCommand, command => {
      this.commands.set(command.name, command);
    });

    this.jobRegister.onRegister(MessageCommand, command => {
      this.commands.set(command.name, command);
    });

    this.jobRegister.onRegister(SubCommand, command => {
      this.subCommands.push(command);
    });

    await this.jobRegister.loadAndRegister(true);
  }

  async importStorages() {
    let storage: StorageImporter = new StorageImporter(this);
    storage.loadAndRegister();
  }

  async setUpSlashCommands() {
    const commands = [];

    let createOption = <T extends SlashCommandOptionBase>(
      optionBuilder: T,
      option: CommandOption,
    ): T => {
      optionBuilder.setName(option.name).setDescription(option.description);
      if (option.required) optionBuilder.setRequired(option.required);

      if (optionBuilder instanceof SlashCommandStringOption) {
        if (option.choices) {
          option.choices.forEach(choice => optionBuilder.addChoice(choice.name, choice.value));
        }
      }

      if (optionBuilder instanceof SlashCommandIntegerOption) {
        if (option.choices) {
          option.choices.forEach(choice => optionBuilder.addChoice(choice.name, choice.value));
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

    this.commands.forEach(command => {
      if (command.type === CommandType.Message || command.type === CommandType.User) {
        commands.push(command);
        return;
      }

      let slashCommand = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.info ? command.info : "-");

      addOptions(command, slashCommand);

      let subCommands = this.subCommands.filter(
        subCommand => subCommand.masterCommand == command.name,
      );
      subCommands.forEach(subCommand => {
        slashCommand.addSubcommand(s => {
          s.setName(subCommand.name).setDescription(subCommand.info);
          return addOptions(subCommand, s);
        });
      });
      let json = slashCommand.toJSON();

      json["type"] = command.type;

      commands.push(json);
    });

    console.log("Setting up " + commands.length + " commands for slash commands.");

    const rest = new REST({ version: "9" }).setToken(this.token);
    try {
      console.log("Started refreshing application (/) commands.");
      if (this.guildId) {
        await rest.put(Routes.applicationGuildCommands(this.clientId, this.guildId), {
          body: commands,
        });
      } else {
        await rest.put(Routes.applicationCommands(this.clientId), {
          body: commands,
        });
      }

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  }
}
