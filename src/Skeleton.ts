import { Snowflake, Client, Events, Interaction, ButtonInteraction } from "discord.js";
import { CommandMediator } from "./command/BaseCommand";
import APICommandProvider from "./deployer/APICommandProvider";
import { Deployer } from "./deployer/Deployer";
import {
  UserCommandImportHandler,
  MessageCommandImportHandler,
} from "./implementations/ContextMenuCommand/ImportHandler";
import ContextMentInteractionHandler from "./implementations/ContextMenuCommand/InteractionHandler";
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
import {
  InteractionHandler,
  ContextMenuCommand,
  SlashCommand,
  SubCommand,
  UserCommand,
  MessageCommand,
  ComponentCommand,
} from "./main";
import { CollectionMediator } from "./command/Mediator";
import {
  ButtonCommand,
  ChannelSelectCommand,
  MentionableSelectCommand,
  RoleSelectCommand,
  SelectBoxCommand,
  StringSelectCommand,
  UserSelectCommand,
} from "./implementations/Component/Command";
import {
  ButtonCommandInteractionHandler,
  ChannelSelectInteractionHandler,
  MentionableSelectInteractionHandler,
  RoleSelectInteractionHandler,
  StringSelectInteractionHandler,
  UserSelectInteractionHandler,
} from "./implementations/Component/InteractionHandler";
import {
  ButtonCommandImportHandler,
  ChannelSelectCommandImportHandler,
  ComponentCommandImportHandler,
  MentionableSelectCommandImportHandler,
  RoleSelectCommandImportHandler,
  SelectCommandImportHandler,
  StringSelectCommandImportHandler,
  UserSelectCommandImportHandler,
} from "./implementations/Component/ImportHandler";

export class Skeleton {
  private interactionHandlers: InteractionHandler<any>[] = [];
  public context: any;

  public importer: Importer;
  public deployer: Deployer;

  private modalSubmitInteractionHandler: ModalInteractionHandler;

  constructor() {
    this.importer = new Importer();
    this.deployer = new Deployer();

    // Set up ContextMenu handlers
    let cxtCommandMediator = new CommandMediator<ContextMenuCommand>();
    let cxtMenuInteractionHandler = new ContextMentInteractionHandler(cxtCommandMediator);
    let userCxtMenuImportHandler = new UserCommandImportHandler(cxtCommandMediator);
    let messageCxtMenuImportHandler = new MessageCommandImportHandler(cxtCommandMediator);
    this.addImportHandler(messageCxtMenuImportHandler);
    this.addImportHandler(userCxtMenuImportHandler);
    this.addInteractionHandler(cxtMenuInteractionHandler);
    this.addCommandProvider(cxtCommandMediator);

    // Set up SlashCommand handlers
    let slashCommandHandler = new CommandMediator<SlashCommand>();
    let slashImportHandler = new SlashCommandImportHandler(slashCommandHandler);
    let slashInteractionHandler = new SlashCommandInteractionHandler(slashCommandHandler);
    this.addImportHandler(slashImportHandler);
    this.addCommandProvider(slashCommandHandler);
    this.addInteractionHandler(slashInteractionHandler);

    // Set up CustomIdCommand handlers
    let subCommandHandler = new SubCommandHandler();
    let subCommandInteractionHandler = new SubCommandInteractionHandler(subCommandHandler);
    let subCommandImportHandler = new SubCommandImportHandler(subCommandHandler);
    let masterCommandImportHandler = new MasterCommandImportHandler(subCommandHandler);
    this.addCommandProvider(subCommandHandler);
    this.addImportHandler(subCommandImportHandler);
    this.addImportHandler(masterCommandImportHandler);
    this.addInteractionHandler(subCommandInteractionHandler);

    // Button component handlers
    let buttonCommandHandler = new CollectionMediator<ButtonCommand>();
    let buttonInteractionHandler = new ButtonCommandInteractionHandler(buttonCommandHandler);
    let buttonImportHandler = new ButtonCommandImportHandler(buttonCommandHandler);
    this.addImportHandler(buttonImportHandler);
    this.addInteractionHandler(buttonInteractionHandler);

    // Common select component handler
    let selectCommandHandler = new CollectionMediator<SelectBoxCommand<any>>();

    // String select handlers
    let stringSelectImportHandler = new StringSelectCommandImportHandler(selectCommandHandler);
    let stringSelectInteractionHandler = new StringSelectInteractionHandler(selectCommandHandler);
    this.addImportHandler(stringSelectImportHandler);
    this.addInteractionHandler(stringSelectInteractionHandler);

    // Role select handlers
    let roleSelectImportHandler = new RoleSelectCommandImportHandler(selectCommandHandler);
    let roleSelectInteractionHandler = new RoleSelectInteractionHandler(selectCommandHandler);
    this.addImportHandler(roleSelectImportHandler);
    this.addInteractionHandler(roleSelectInteractionHandler);

    // Channel select handlers
    let channelSelectImportHandler = new ChannelSelectCommandImportHandler(selectCommandHandler);
    let channelSelectInteractionHandler = new ChannelSelectInteractionHandler(selectCommandHandler);
    this.addImportHandler(channelSelectImportHandler);
    this.addInteractionHandler(channelSelectInteractionHandler);

    // User select handlers
    let userSelectImportHandler = new UserSelectCommandImportHandler(selectCommandHandler);
    let userSelectInteractionHandler = new UserSelectInteractionHandler(selectCommandHandler);
    this.addImportHandler(userSelectImportHandler);
    this.addInteractionHandler(userSelectInteractionHandler);

    // Mentionable select handlers
    let mentionableSelectImportHandler = new MentionableSelectCommandImportHandler(
      selectCommandHandler,
    );
    let mentionableSelectInteractionHandler = new MentionableSelectInteractionHandler(
      selectCommandHandler,
    );
    this.addImportHandler(mentionableSelectImportHandler);
    this.addInteractionHandler(mentionableSelectInteractionHandler);

    // Modal
    this.modalSubmitInteractionHandler = new ModalInteractionHandler();
    this.addInteractionHandler(this.modalSubmitInteractionHandler);
  }

  handleModalSubmit(customId: string, func: ModalSubmitCommand) {
    this.modalSubmitInteractionHandler.handleModalSubmit(customId, func);
  }

  addImportHandler(importHandler: ImportHandler<any>) {
    this.importer.addImportHandler(importHandler);
  }

  attachClient(client: Client) {
    client.on("interactionCreate", async i => this.onInteraction(i));
  }

  deattachClient(client: Client) {
    client.removeAllListeners("interactionCreate");
  }

  async run(options: { token: string; appId: string; guildId?: Snowflake; client: Client }) {
    if (!this.context)
      console.warn(
        "No context for commands was provided. The context parameter will be undefined. Call skeleton.setContext().",
      );

    console.log("~~~~~ Login in ~~~~~");

    try {
      options.client.login(options.token);
    } catch (error) {
      throw error;
    }

    options.client.once(Events.ClientReady, async (c: Client) => {
      console.log("Successfully logged in.");

      console.log("~~~~~ Importer ~~~~~");
      await this.importer.run();

      console.log("~~~~~ Deployer ~~~~~");
      await this.deployer.deploy(options);
    });
  }

  addCommand(command: SubCommand): void;
  addCommand(command: SlashCommand): void;
  addCommand(command: UserCommand): void;
  addCommand(command: MessageCommand): void;
  addCommand(command: SubCommand): void;
  addCommand(command: ComponentCommand): void;
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
      let didHandle = false;
      for (let handler of this.interactionHandlers) {
        if (handler.performCheck(interaction, this.context)) {
          didHandle = true;
          handler.performExecute(interaction, this.context, this);
        }
      }

      if (!didHandle) {
        console.log(`Did not handle interaction, ${interaction.id}`);
      }
    } catch (err) {
      console.error(err);
      // send an error message to the user if possible
    }
  }

  public addInteractionHandler(handler: InteractionHandler<any>) {
    this.interactionHandlers.push(handler);
  }

  public setContext(context: any) {
    this.context = context;
  }
}
