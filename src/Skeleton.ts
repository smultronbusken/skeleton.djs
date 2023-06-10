import { Snowflake, Client, Interaction, Events, ModalSubmitInteraction } from "discord.js";
import { CollectionMediator, Mediator } from "./command/Mediator";
import APICommandProvider from "./deployer/APICommandProvider";
import { Deployer } from "./deployer/Deployer";
import { InteractionHandler } from "./eventhandlers/InteractionHandler";
import {
  ContextMenuCommand,
  UserCommand,
  MessageCommand,
} from "./implementations/ContextMenuCommand/Command";
import {
  UserCommandImportHandler,
  MessageCommandImportHandler,
} from "./implementations/ContextMenuCommand/ImportHandler";
import { CustomIdCommand } from "./implementations/CustomId/Command";
import { CustomIdCommandImportHandler } from "./implementations/CustomId/ImportHandler";
import CustomIdCommandInteractionHandler from "./implementations/CustomId/InteractionHandler";
import { SlashCommand } from "./implementations/SlashCommand/Command";
import { SlashCommandImportHandler } from "./implementations/SlashCommand/ImportHandler";
import SlashCommandInteractionHandler from "./implementations/SlashCommand/InteractionHandler";
import SubCommandHandler from "./implementations/SubCommand/CommandHandler";
import {
  SubCommandImportHandler,
  MasterCommandImportHandler,
} from "./implementations/SubCommand/ImportHandler";
import SubCommandInteractionHandler from "./implementations/SubCommand/InteractionHandler";
import { MasterCommand } from "./implementations/SubCommand/MasterCommand";
import { SubCommand } from "./implementations/SubCommand/SubCommand";
import ImportHandler from "./importer/ImportHandler";
import { Importer } from "./importer/Importer";
import ContextMentInteractionHandler from "./implementations/ContextMenuCommand/InteractionHandler";
import ModalInteractionHandler, {
  ModalSubmitCommand,
} from "./implementations/Modal/InteractionHandler";
import CustomIdCommandHandler from "./implementations/CustomId/CommandHandler";

export class Skeleton<T> {
  private interactionHandlers: InteractionHandler<any>[] = [];
  private context: T;

  private importer: Importer;
  private deployer: Deployer;

  private cxtMenuCommandHandler: Mediator<ContextMenuCommand<T>> & APICommandProvider;
  private slashCommandHandler: Mediator<SlashCommand<T>> & APICommandProvider;
  private customIdCommandHandler: Mediator<CustomIdCommand<T>>;
  private subCommandHandler: SubCommandHandler;
  private modalSubmitInteractionHandler: ModalInteractionHandler;

  constructor() {
    this.importer = new Importer();
    this.deployer = new Deployer();

    // Set up ContextMenu handlers
    this.cxtMenuCommandHandler = new CommandMediator<UserCommand<T>>();
    let cxtMenuInteractionHandler = new ContextMentInteractionHandler(this.cxtMenuCommandHandler);
    let userCxtMenuImportHandler = new UserCommandImportHandler(this.cxtMenuCommandHandler);
    let messageCxtMenuImportHandler = new MessageCommandImportHandler(this.cxtMenuCommandHandler);
    this.addImportHandler(messageCxtMenuImportHandler);
    this.addImportHandler(userCxtMenuImportHandler);
    this.registerInteractionHandler(cxtMenuInteractionHandler);
    this.addCommandProvider(this.cxtMenuCommandHandler);

    // Set up SlashCommand handlers
    this.slashCommandHandler = new CommandMediator<SlashCommand<T>>();
    let slashImportHandler = new SlashCommandImportHandler(this.slashCommandHandler);
    let slashInteractionHandler = new SlashCommandInteractionHandler(this.slashCommandHandler);
    this.addCommandProvider(this.slashCommandHandler);
    this.addImportHandler(slashImportHandler);
    this.registerInteractionHandler(slashInteractionHandler);

    // Set up CustomIdCommand handlers
    this.customIdCommandHandler = new CollectionMediator<CustomIdCommand<T>>();
    let customIdCommandImportHandler = new CustomIdCommandImportHandler(
      this.customIdCommandHandler,
    );
    let customIdCommandInteractionHandler = new CustomIdCommandInteractionHandler(
      this.customIdCommandHandler,
    );
    this.addImportHandler(customIdCommandImportHandler);
    this.registerInteractionHandler(customIdCommandInteractionHandler);

    // Set up CustomIdCommand handlers
    this.subCommandHandler = new SubCommandHandler();
    let subCommandInteractionHandler = new SubCommandInteractionHandler(this.subCommandHandler);
    let subCommandImportHandler = new SubCommandImportHandler(this.subCommandHandler);
    let masterCommandImportHandler = new MasterCommandImportHandler(this.subCommandHandler);
    this.addCommandProvider(this.subCommandHandler);
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
  addCommand(command: CustomIdCommand<T>): void;
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
