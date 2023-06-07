import { Snowflake, Client, Interaction, BaseInteraction, APIApplicationCommand } from "discord.js";
import { CommandDeployer } from "./CommandDeployer";
import { JobRegistry, Job } from "./Jobs";
import ContextMenuCommandHandler from "./command/ContextMenuCommandHandler";
import CustomIdCommandHandler from "./command/CustomIdCommandHandler";
import SlashCommandHandler from "./command/SlashCommandHandler";
import ContextMenuInteractionHandler from "./interactionHandlers/ContextMenuInteractionHandler";
import { InteractionHandler } from "./interactionHandlers/InteractionHandler";
import SubCommandInteractionHandler from "./interactionHandlers/SubCommandInteractionHandler";
import { UserCommandJobHandler, MessageCommandJobHandler } from "./jobHandler/ContextMenuCommandJobHandler";
import { CustomIdCommandJobHandler } from "./jobHandler/CustomIdCommandJobHandler";
import RegistrationHandler from "./jobHandler/JobRegister";
import { SubCommandJobHandler, MasterCommandJobHandler } from "./jobHandler/SubCommandJobHandler";
import SlashCommandInteractionHandler from "./interactionHandlers/SlashCommandInteractionHandler";
import { SlashCommandJobHandler } from "./jobHandler/SlashCommandJobHandler";
import SubCommandHandler from "./command/SubCommandHandler";
import CustomIdCommandInteractionHandler from "./interactionHandlers/CustomIdInteractionHandler";


export class Skeleton<T> {
  private interactionHandlers: InteractionHandler<any, T>[] = [];
  private context: T;

  private jobRegister: JobRegistry;
  private commandDeployer: CommandDeployer;

  constructor() {
    this.jobRegister = new JobRegistry();
    this.commandDeployer = new CommandDeployer();
  }

  onRegister<J extends Job<any>>(registrationHandler: RegistrationHandler<J>) {
    this.jobRegister.onRegister(registrationHandler.jobType, registrationHandler.onRegister);
  }

  async run(options: { token: string; appId: string; guildId?: Snowflake; client: Client }) {
    options.client.on("interactionCreate", async i => this.onInteraction(i));

    // Set up ContextMenu handlers
    let cxtMenuCommandHandler = new ContextMenuCommandHandler();
    let cxtMenuInteractionHandler = new ContextMenuInteractionHandler(cxtMenuCommandHandler);
    let userCxtMenuJobHandler = new UserCommandJobHandler(cxtMenuCommandHandler);
    let messageCxtMenuJobHandler = new MessageCommandJobHandler(cxtMenuCommandHandler);
    this.onRegister(messageCxtMenuJobHandler);
    this.onRegister(userCxtMenuJobHandler);
    this.registerInteractionHandler(cxtMenuInteractionHandler);
    this.addCommandProvider(() => cxtMenuCommandHandler.convertCommandsToJSON());
    
    // Set up SlashCommand handlers
    let slashCommandHandler = new SlashCommandHandler();
    let slashJobHandler = new SlashCommandJobHandler(slashCommandHandler);
    let slashInteractionHandler = new SlashCommandInteractionHandler(slashCommandHandler);
    this.addCommandProvider(() => slashCommandHandler.convertCommandsToJSON());
    this.onRegister(slashJobHandler);
    this.registerInteractionHandler(slashInteractionHandler);
    
    // Set up CustomIdCommand handlers
    let customIdCommandHandler = new CustomIdCommandHandler();
    let customIdCommandJobHandler = new CustomIdCommandJobHandler(customIdCommandHandler);
    let customIdCommandInteractionHandler = new CustomIdCommandInteractionHandler(customIdCommandHandler);
    this.onRegister(customIdCommandJobHandler);
    this.registerInteractionHandler(customIdCommandInteractionHandler);
    
    // Set up CustomIdCommand handlers
    let subCommandHandler = new SubCommandHandler();
    let subCommandInteractionHandler = new SubCommandInteractionHandler(subCommandHandler);
    let subCommandJobHandler = new SubCommandJobHandler(subCommandHandler);
    let masterCommandJobHandler = new MasterCommandJobHandler(subCommandHandler);
    this.addCommandProvider(() => subCommandHandler.convertCommandsToJSON());
    this.onRegister(subCommandJobHandler);
    this.onRegister(masterCommandJobHandler);
    this.registerInteractionHandler(subCommandInteractionHandler);

    await this.jobRegister.loadAndRegister();
    await this.commandDeployer.deploy(options);
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
      console.log(interaction)
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
