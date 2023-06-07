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
import { Job, JobRegister, TConstructable } from "./Jobs";
import { InteractionHandler } from "./interactions/InteractionHandler";
import { CommandDeployer } from "./CommandDeployer";

export class Skeleton<T> {
  private interactionHandlers: InteractionHandler<any>[] = [];
  private context: T;

  private jobRegister: JobRegister;
  private commandDeployer: CommandDeployer;

  constructor() {
    this.jobRegister = new JobRegister();
    this.commandDeployer = new CommandDeployer();
  }

  onRegister<T extends Job<any>>(jobClass: TConstructable<T>, func: (job: T) => void) {
    this.jobRegister.onRegister(jobClass, func);
  }

  async run(options: { token: string; appId: string; guildId?: Snowflake; client: Client }) {
    options.client.on("interactionCreate", async i => this.onInteraction(i));
    await this.jobRegister.loadAndRegister();
    await this.commandDeployer.deploy(options);
  }

  addCommandProvider(provider: () => object[]) {
    this.commandDeployer.addCommandProvider(provider);
  }

  private async onInteraction(interaction: Interaction) {
    try {
      for (let handler of this.interactionHandlers) {
        if (handler.typeGuard(interaction)) {
          if (handler.check(interaction, this.context)) {
            await handler.execute(interaction, this.context);
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

  public setContext(context: T) {
    this.context = context;
  }
}
