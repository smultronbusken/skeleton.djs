import { Snowflake, Client, Events, Interaction } from "discord.js";
import { Mediator, CollectionMediator } from "./command/Mediator";
import APICommandProvider from "./deployer/APICommandProvider";
import { Deployer } from "./deployer/Deployer";
import {
  UserCommandImportHandler,
  MessageCommandImportHandler,
} from "./implementations/ContextMenuCommand/ImportHandler";
import ContextMentInteractionHandler from "./implementations/ContextMenuCommand/InteractionHandler";
import { ComponentCommandImportHandler } from "./implementations/Component/ImportHandler";
import ComponentCommandInteractionHandler from "./implementations/Component/InteractionHandler";
import ModalInteractionHandler, {
  ModalSubmitCommand,
} from "./implementations/Modal/InteractionHandler";
import { SlashCommandImportHandler } from "./implementations/SlashCommand/ImportHandler";
import SlashCommandInteractionHandler from "./implementations/SlashCommand/InteractionHandler";
import SubCommandHandler from "./implementations/SubCommand/CommandHandler";
import {
  SubCommandImportHandler,
  MasterCommandImportHandler,
} from "./implementations/SubCommand/ImportHandler";
import SubCommandInteractionHandler from "./implementations/SubCommand/InteractionHandler";
import ImportHandler from "./importer/ImportHandler";
import { Importer } from "./importer/Importer";
import { CommandMediator } from "./command/BaseCommand";
import { InteractionHandler } from "./eventhandlers/InteractionHandler";
import {
  ContextMenuCommand,
  MessageCommand,
  UserCommand,
} from "./implementations/ContextMenuCommand/Command";
import { SlashCommand } from "./implementations/SlashCommand/Command";
import { ComponentCommand } from "./implementations/Component/Command";
import { SubCommand } from "./implementations/SubCommand/SubCommand";

export class Skeleton<T> {
  private interactionHandlers: InteractionHandler<any>[] = [];
  private context: T;

  private importer: Importer;
  private deployer: Deployer;

  private modalSubmitInteractionHandler: ModalInteractionHandler;

  constructor() {
    this.importer = new Importer();
    this.deployer = new Deployer();

    // Set up ContextMenu handlers
    let cxtCommandMediator = new CommandMediator<ContextMenuCommand<T>>();
    let cxtMenuInteractionHandler = new ContextMentInteractionHandler(cxtCommandMediator);
    let userCxtMenuImportHandler = new UserCommandImportHandler(cxtCommandMediator);
    let messageCxtMenuImportHandler = new MessageCommandImportHandler(cxtCommandMediator);
    this.addImportHandler(messageCxtMenuImportHandler);
    this.addImportHandler(userCxtMenuImportHandler);
    this.registerInteractionHandler(cxtMenuInteractionHandler);
    this.addCommandProvider(cxtCommandMediator);

    // Set up SlashCommand handlers
    let slashCommandHandler = new CommandMediator<SlashCommand<T>>();
    let slashImportHandler = new SlashCommandImportHandler(slashCommandHandler);
    let slashInteractionHandler = new SlashCommandInteractionHandler(slashCommandHandler);
    this.addImportHandler(slashImportHandler);
    this.addCommandProvider(slashCommandHandler);
    this.registerInteractionHandler(slashInteractionHandler);

    // Set up CustomIdCommand handlers
    let componentCommandHandler = new CollectionMediator<ComponentCommand<T>>();
    let componentCommandImportHandler = new ComponentCommandImportHandler(componentCommandHandler);
    let componentCommandInteractionHandler = new ComponentCommandInteractionHandler(
      componentCommandHandler,
    );
    this.addImportHandler(componentCommandImportHandler);
    this.registerInteractionHandler(componentCommandInteractionHandler);

    // Set up CustomIdCommand handlers
    let subCommandHandler = new SubCommandHandler();
    let subCommandInteractionHandler = new SubCommandInteractionHandler(subCommandHandler);
    let subCommandImportHandler = new SubCommandImportHandler(subCommandHandler);
    let masterCommandImportHandler = new MasterCommandImportHandler(subCommandHandler);
    this.addCommandProvider(subCommandHandler);
    this.addImportHandler(subCommandImportHandler);
    this.addImportHandler(masterCommandImportHandler);
    this.registerInteractionHandler(subCommandInteractionHandler);

    // Modal
    this.modalSubmitInteractionHandler = new ModalInteractionHandler();
    this.registerInteractionHandler(this.modalSubmitInteractionHandler);
  }

  handleModalSubmit(customId: string, func: ModalSubmitCommand) {
    this.modalSubmitInteractionHandler.handleModalSubmit(customId, func);
  }

  addImportHandler(importHandler: ImportHandler<any>) {
    this.importer.addImportHandler(importHandler);
  }

  async run(options: { token: string; appId: string; guildId?: Snowflake; client: Client }) {
    console.log("~~~~~ Login in ~~~~~");

    try {
      options.client.login(options.token);
    } catch (error) {
      throw error;
    }

    options.client.once(Events.ClientReady, async (c: Client) => {
      console.log("Successfully logged in.");

      options.client.on("interactionCreate", async i => this.onInteraction(i));

      console.log("~~~~~ Importer ~~~~~");
      await this.importer.run();

      console.log("~~~~~ Deployer ~~~~~");
      await this.deployer.deploy(options);
    });
  }

  addCommand(command: SubCommand<T>): void;
  addCommand(command: SlashCommand<T>): void;
  addCommand(command: UserCommand<T>): void;
  addCommand(command: MessageCommand<T>): void;
  addCommand(command: SubCommand<T>): void;
  addCommand(command: ComponentCommand<T>): void;
  addCommand(command: any): void {
    this.importer.importObject(command);
  }

  importObject(obj: Object) {
    this.importer.importObject(obj);
  }

  addCommandProvider(provider: APICommandProvider) {
    this.deployer.addCommandProvider(provider);
  }

  private async onInteraction(interaction: Interaction) {
    try {
      for (let handler of this.interactionHandlers) {
        if (await handler.performCheck(interaction, this.context)) {
          await handler.performExecute(interaction, this.context, this);
          return;
        }
      }
      console.log(interaction);
      console.log(`Unsupported interaction type, ${interaction.toString()}`);
    } catch (err) {
      console.error(err);
      // send an error message to the user if possible
    }
  }

  public registerInteractionHandler(handler: InteractionHandler<any>) {
    this.interactionHandlers.push(handler);
  }

  public setContext(context: T) {
    this.context = context;
  }
}
