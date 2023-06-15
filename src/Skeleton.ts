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
  private context: any;

  private importer: Importer;
  private deployer: Deployer;

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
    let buttonImportHandler = new ComponentCommandImportHandler<ButtonCommand>(
      buttonCommandHandler,
    );
    this.addImportHandler(buttonImportHandler);
    this.addInteractionHandler(buttonInteractionHandler);

    // String select handlers
    let stringSelectCommandHandler = new CollectionMediator<StringSelectCommand>();
    let stringSelectImportHandler = new StringSelectCommandImportHandler(
      stringSelectCommandHandler,
    );
    let stringSelectInteractionHandler = new StringSelectInteractionHandler(
      stringSelectCommandHandler,
    );
    this.addImportHandler(stringSelectImportHandler);
    this.addInteractionHandler(stringSelectInteractionHandler);

    // Role select handlers
    let roleSelectCommandHandler = new CollectionMediator<RoleSelectCommand>();
    let roleSelectImportHandler = new RoleSelectCommandImportHandler(roleSelectCommandHandler);
    let roleSelectInteractionHandler = new RoleSelectInteractionHandler(roleSelectCommandHandler);
    this.addImportHandler(roleSelectImportHandler);
    this.addInteractionHandler(roleSelectInteractionHandler);

    // Channel select handlers
    let channelSelectCommandHandler = new CollectionMediator<ChannelSelectCommand>();
    let channelSelectImportHandler = new ChannelSelectCommandImportHandler(
      channelSelectCommandHandler,
    );
    let channelSelectInteractionHandler = new ChannelSelectInteractionHandler(
      channelSelectCommandHandler,
    );
    this.addImportHandler(channelSelectImportHandler);
    this.addInteractionHandler(channelSelectInteractionHandler);

    // User select handlers
    let userSelectCommandHandler = new CollectionMediator<UserSelectCommand>();
    let userSelectImportHandler = new UserSelectCommandImportHandler(userSelectCommandHandler);
    let userSelectInteractionHandler = new UserSelectInteractionHandler(userSelectCommandHandler);
    this.addImportHandler(userSelectImportHandler);
    this.addInteractionHandler(userSelectInteractionHandler);

    // Mentionable select handlers
    let mentionableSelectCommandHandler = new CollectionMediator<MentionableSelectCommand>();
    let mentionableSelectImportHandler = new MentionableSelectCommandImportHandler(
      mentionableSelectCommandHandler,
    );
    let mentionableSelectInteractionHandler = new MentionableSelectInteractionHandler(
      mentionableSelectCommandHandler,
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

      options.client.on("interactionCreate", async i => this.onInteraction(i));

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
