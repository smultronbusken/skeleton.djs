import { Snowflake } from "discord-api-types/v9";
import {
  BaseInteraction,
  Client,
  ClientOptions,
  Collection,
  CommandInteraction,
  Interaction,
} from "discord.js";
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
import {
  InteractionHandler,
  chatInputCommandInteractionHandler,
  contextMenuCommandInteractionHandler,
} from "./InteractionHandler";

export class Skeleton<T> {
  private commands: Collection<string, CommandBase<T>> = new Collection();
  private interactionHandlers: InteractionHandler<any>[] = [];
  private context: T;

  private jobRegister: JobRegister;

  constructor() {
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
      this.commands.set(command.masterCommand + "/" + command.name, command);
    });
  }

  async run(options: { token: string; appId: string; guildId?: Snowflake; client: Client }) {
    options.client.on("interactionCreate", async i => this.onInteraction(i));

    this.registerInteractionHandler(contextMenuCommandInteractionHandler);
    this.registerInteractionHandler(chatInputCommandInteractionHandler);

    await this.jobRegister.loadAndRegister();

    let JSONCommands = convertCommandsToJson(this.commands);
    await registerCommands(JSONCommands, options.token, options.appId, options.guildId, true);
  }

  private async onInteraction(interaction: Interaction) {
    try {
      console.log(interaction);
      for (let handler of this.interactionHandlers) {
        if (handler.typeGuard(interaction)) {
          if (handler.check(interaction)) {
            await handler.execute(interaction, this.commands, this.context);
            return;
          }
        }
      }

      throw new Error(`Unsupported interaction type`);
    } catch (err) {
      console.error(err);
      // send an error message to the user if possible
    }
  }

  public registerInteractionHandler<I extends BaseInteraction>(handler: InteractionHandler<I>) {
    this.interactionHandlers.push(handler);
  }

  public addCommand(command: CommandBase<T>) {
    this.commands.set(command.name, command);
  }

  public setContext(context: T) {
    this.context = context;
  }
}
