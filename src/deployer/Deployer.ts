import {
  SlashCommandStringOption,
  SlashCommandIntegerOption,
  SlashCommandSubcommandBuilder,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  ApplicationCommandOptionBase,
  StringSelectMenuOptionBuilder,
} from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { APIApplicationCommand, Client, Collection, Snowflake } from "discord.js";
import APICommandProvider from "./APICommandProvider";

interface DeployOptions {
  /** The bot token. */
  token: string;
  /** The application ID. */
  appId: string;
  /** The optional guild ID. If provided, the commands will be deployed to this guild. */
  guildId?: Snowflake;
}

/**
 * The Deployer class is responsible for deploying commands to Discord.
 */
export class Deployer {
  private commandProviders: APICommandProvider[] = [];

  /**
   * Adds a command provider to the list of command providers.
   * When {@link Deployer.deploy} is run, it will gather commands from all the command providers
   */
  public addCommandProvider(provider: APICommandProvider) {
    this.commandProviders.push(provider);
  }

  /**
   * Deploys commands to Discord.
   */
  public async deploy(options: DeployOptions) {
    let commands: APIApplicationCommand[] = [];
    this.commandProviders.forEach(
      commandProvider => (commands = commands.concat(commandProvider.getAPICommands())),
    );
    await this.sendRequest(commands, options);
  }

  /**
   * Sends a request to Discord to deploy the commands.
   * @param {APIApplicationCommand[]} JSONCommands - The commands to deploy.
   * @private
   */
  private async sendRequest(JSONCommands: APIApplicationCommand[], options: DeployOptions) {
    console.log("Deploying " + JSONCommands.length + " commands.");
    const rest = new REST({ version: "9" }).setToken(options.token);
    try {
      console.log("Refreshing application commands.");
      if (options.guildId) {
        await rest.put(Routes.applicationGuildCommands(options.appId, options.guildId), {
          body: JSONCommands,
        });
      } else {
        await rest.put(Routes.applicationCommands(options.appId), {
          body: JSONCommands,
        });
      }

      console.log("Successfully deployed commands.");
    } catch (error) {
      console.error(error);
    }
  }
}
