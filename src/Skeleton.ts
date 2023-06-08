import { Snowflake, Client, APIApplicationCommand, Interaction, BaseInteraction } from "discord.js";
import { CommandDeployer } from "./CommandDeployer";
import { Importer } from "./Importer";
import { CommandMediator } from "./commandHandlers/CommandMediator";
import { CommandToJSON } from "./commandHandlers/CommandToJSON";
import ContextMenuCommandHandler from "./commandHandlers/ContextMenuCommandHandler";
import CustomIdCommandHandler, { CustomIdCommand } from "./commandHandlers/CustomIdCommandHandler";
import SlashCommandHandler from "./commandHandlers/SlashCommandHandler";
import SubCommandHandler from "./commandHandlers/SubCommandHandler";
import { ContextMenuCommand, SlashCommand, UserCommand, MessageCommand, SubCommand, MasterCommand } from "./commandTypes/CommandTypes";
import { UserCommandImportHandler, MessageCommandImportHandler } from "./importHandlers/ContextMenuCommandImportHandler";
import { CustomIdCommandImportHandler } from "./importHandlers/CustomIdCommandImportHandler";
import ImportHandler from "./importHandlers/ImportHandler";
import { SlashCommandImportHandler } from "./importHandlers/SlashCommandImportHandler";
import { SubCommandImportHandler, MasterCommandImportHandler } from "./importHandlers/SubCommandImportHandler";
import ContextMenuInteractionHandler from "./interactionHandlers/ContextMenuInteractionHandler";
import CustomIdCommandInteractionHandler from "./interactionHandlers/CustomIdInteractionHandler";
import { InteractionHandler } from "./interactionHandlers/InteractionHandler";
import SlashCommandInteractionHandler from "./interactionHandlers/SlashCommandInteractionHandler";
import SubCommandInteractionHandler from "./interactionHandlers/SubCommandInteractionHandler";

export class Skeleton<T> {
  private interactionHandlers: InteractionHandler<any, T>[] = [];
  private context: T;

  private importer: Importer;
  private commandDeployer: CommandDeployer;

  private cxtMenuCommandHandler: CommandMediator<ContextMenuCommand<T>> & CommandToJSON;
  private slashCommandHandler: CommandMediator<SlashCommand<T>> & CommandToJSON;
  private customIdCommandHandler: CommandMediator<CustomIdCommand<T>>;
  private subCommandHandler: SubCommandHandler<T>;

  constructor() {

    this.importer = new Importer();
    this.commandDeployer = new CommandDeployer();

    // Set up ContextMenu handlers
    this.cxtMenuCommandHandler = new ContextMenuCommandHandler();
    let cxtMenuInteractionHandler = new ContextMenuInteractionHandler(this.cxtMenuCommandHandler);
    let userCxtMenuImportHandler = new UserCommandImportHandler(this.cxtMenuCommandHandler);
    let messageCxtMenuImportHandler = new MessageCommandImportHandler(this.cxtMenuCommandHandler);
    this.addImportListener(messageCxtMenuImportHandler);
    this.addImportListener(userCxtMenuImportHandler);
    this.registerInteractionHandler(cxtMenuInteractionHandler);
    this.addCommandProvider(() => this.cxtMenuCommandHandler.convertCommandsToJSON());

    // Set up SlashCommand handlers
    this.slashCommandHandler = new SlashCommandHandler();
    let slashImportHandler = new SlashCommandImportHandler(this.slashCommandHandler);
    let slashInteractionHandler = new SlashCommandInteractionHandler(this.slashCommandHandler);
    this.addCommandProvider(() => this.slashCommandHandler.convertCommandsToJSON());
    this.addImportListener(slashImportHandler);
    this.registerInteractionHandler(slashInteractionHandler);

    // Set up CustomIdCommand handlers
    this.customIdCommandHandler = new CustomIdCommandHandler();
    let customIdCommandImportHandler = new CustomIdCommandImportHandler(this.customIdCommandHandler);
    let customIdCommandInteractionHandler = new CustomIdCommandInteractionHandler(
      this.customIdCommandHandler,
    );
    this.addImportListener(customIdCommandImportHandler);
    this.registerInteractionHandler(customIdCommandInteractionHandler);

    // Set up CustomIdCommand handlers
    this.subCommandHandler = new SubCommandHandler();
    let subCommandInteractionHandler = new SubCommandInteractionHandler(this.subCommandHandler);
    let subCommandImportHandler = new SubCommandImportHandler(this.subCommandHandler);
    let masterCommandImportHandler = new MasterCommandImportHandler(this.subCommandHandler);
    this.addCommandProvider(() => this.subCommandHandler.convertCommandsToJSON());
    this.addImportListener(subCommandImportHandler);
    this.addImportListener(masterCommandImportHandler);
    this.registerInteractionHandler(subCommandInteractionHandler);
  }

  addImportListener(importHandler: ImportHandler<any>) {
    this.importer.addListener(importHandler.classToBeImported, importHandler.onImport);
  }

  async run(options: { token: string; appId: string; guildId?: Snowflake; client: Client }) {
    options.client.on("interactionCreate", async i => this.onInteraction(i));

    await this.importer.run();
    await this.commandDeployer.deploy(options);
  }

  addSlashCommand(command: SlashCommand<T>) {
    this.slashCommandHandler.setCommand(command.data.name, command);
  }

  addUserCommand(command: UserCommand<T>) {
    this.cxtMenuCommandHandler.setCommand(command.data.name, command);
  }

  addMessageCommand(command: MessageCommand<T>) {
    this.cxtMenuCommandHandler.setCommand(command.data.name, command);
  }

  addSubCommand(command: SubCommand<T>) {
    this.subCommandHandler.setCommand(command.data.name, command);
  }

  addMasterCommand(command: MasterCommand<T>) {
    this.subCommandHandler.setMasterCommand(command.data.name, command);
  }

  addCommandProvider(provider: () => APIApplicationCommand[]) {
    this.commandDeployer.addCommandProvider(provider);
  }

  private async onInteraction(interaction: Interaction) {
    try {
      for (let handler of this.interactionHandlers) {
        if (await handler.performCheck(interaction, this.context)) {
          await handler.performExecute(interaction, this.context);
          return;
        }
      }
      console.log(interaction);
      throw new Error(`Unsupported interaction type`);
    } catch (err) {
      console.error(err);
      // send an error message to the user if possible
    }
  }

  public registerInteractionHandler<I extends BaseInteraction>(handler: InteractionHandler<I, T>) {
    this.interactionHandlers.push(handler);
  }

  public setContext(context: T) {
    this.context = context;
  }
}
