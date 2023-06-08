import { Snowflake, Client, APIApplicationCommand, Interaction, BaseInteraction } from "discord.js";
import { CommandDeployer } from "./CommandDeployer";
import { CommandMediator } from "./command/CommandMediator";
import { CommandToJSON } from "./command/CommandToJSON";
import ContextMenuCommandHandler, {
  ContextMenuCommand,
  UserCommand,
  MessageCommand,
} from "./command/ContextMenuCommandHandler";
import CustomIdCommandHandler, { CustomIdCommand } from "./command/CustomIdCommandHandler";
import SlashCommandHandler, { SlashCommand } from "./command/SlashCommandHandler";
import SubCommandHandler, { MasterCommand, SubCommand } from "./command/SubCommandHandler";
import ContextMenuInteractionHandler from "./interactionHandlers/ContextMenuInteractionHandler";
import CustomIdCommandInteractionHandler from "./interactionHandlers/CustomIdInteractionHandler";
import { InteractionHandler } from "./interactionHandlers/InteractionHandler";
import SlashCommandInteractionHandler from "./interactionHandlers/SlashCommandInteractionHandler";
import SubCommandInteractionHandler from "./interactionHandlers/SubCommandInteractionHandler";
import {
  UserCommandJobHandler,
  MessageCommandJobHandler,
} from "./jobHandler/ContextMenuCommandJobHandler";
import { CustomIdCommandJobHandler } from "./jobHandler/CustomIdCommandJobHandler";
import RegistrationHandler from "./jobHandler/JobRegister";
import { SlashCommandJobHandler } from "./jobHandler/SlashCommandJobHandler";
import { SubCommandJobHandler, MasterCommandJobHandler } from "./jobHandler/SubCommandJobHandler";
import { Importable, Importer } from "./Importer";

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
    let userCxtMenuJobHandler = new UserCommandJobHandler(this.cxtMenuCommandHandler);
    let messageCxtMenuJobHandler = new MessageCommandJobHandler(this.cxtMenuCommandHandler);
    this.onRegister(messageCxtMenuJobHandler);
    this.onRegister(userCxtMenuJobHandler);
    this.registerInteractionHandler(cxtMenuInteractionHandler);
    this.addCommandProvider(() => this.cxtMenuCommandHandler.convertCommandsToJSON());

    // Set up SlashCommand handlers
    this.slashCommandHandler = new SlashCommandHandler();
    let slashJobHandler = new SlashCommandJobHandler(this.slashCommandHandler);
    let slashInteractionHandler = new SlashCommandInteractionHandler(this.slashCommandHandler);
    this.addCommandProvider(() => this.slashCommandHandler.convertCommandsToJSON());
    this.onRegister(slashJobHandler);
    this.registerInteractionHandler(slashInteractionHandler);

    // Set up CustomIdCommand handlers
    this.customIdCommandHandler = new CustomIdCommandHandler();
    let customIdCommandJobHandler = new CustomIdCommandJobHandler(this.customIdCommandHandler);
    let customIdCommandInteractionHandler = new CustomIdCommandInteractionHandler(
      this.customIdCommandHandler,
    );
    this.onRegister(customIdCommandJobHandler);
    this.registerInteractionHandler(customIdCommandInteractionHandler);

    // Set up CustomIdCommand handlers
    this.subCommandHandler = new SubCommandHandler();
    let subCommandInteractionHandler = new SubCommandInteractionHandler(this.subCommandHandler);
    let subCommandJobHandler = new SubCommandJobHandler(this.subCommandHandler);
    let masterCommandJobHandler = new MasterCommandJobHandler(this.subCommandHandler);
    this.addCommandProvider(() => this.subCommandHandler.convertCommandsToJSON());
    this.onRegister(subCommandJobHandler);
    this.onRegister(masterCommandJobHandler);
    this.registerInteractionHandler(subCommandInteractionHandler);
  }

  onRegister(registrationHandler: RegistrationHandler<any>) {
    this.importer.addListener(registrationHandler.jobType, registrationHandler.onRegister);
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
