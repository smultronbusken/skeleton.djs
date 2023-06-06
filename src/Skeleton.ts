import { Snowflake } from "discord-api-types/v9";
import { Client, ClientOptions, Collection, Interaction } from "discord.js";
import StormDB from "stormdb";
import { EventEmitter } from "stream";
import { convertCommandsToJson, registerCommands } from "./CommandRegistration";
import {
  CommandBase,
  JobRegister,
  MessageCommand,
  SlashCommand,
  SubCommand,
  UserCommand,
} from "./Jobs";

export class Skeleton<T> {
  public commands: Collection<string, CommandBase<T>> = new Collection();
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
    this.client.on("interactionCreate", async i => this.onInteraction(i));
    this.jobRegister = new JobRegister();
    this.init();
  }

  on(event: string, fn: (...args: any) => any) {
    this.emitter.on(event, fn);
  }

  async init() {
    await this.importJobs();
    let JSONCommands = convertCommandsToJson(this.commands);
    registerCommands(JSONCommands, this.token, this.clientId, this.guildId, true);
    this.emitter.emit("ready");
  }

  async importJobs() {
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
      this.commands.set(command.masterCommand+"/"+command.name, command);
    });

    await this.jobRegister.loadAndRegister();
  }

  private onInteraction(interaction: Interaction) {
    if (interaction.isChatInputCommand()) {

      let commandName = interaction.commandName;

      let subCommandName = interaction.options.getSubcommand(false);
      if (subCommandName) commandName += "/" + subCommandName;

      this.commands.get(commandName).execute(interaction, this.app);
    }

    if (interaction.isContextMenuCommand()) {
      this.commands.get(interaction.commandName).execute(interaction, this.app);
    }
  }
}
