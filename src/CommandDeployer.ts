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
import { Client, Collection, Snowflake } from "discord.js";

export class CommandDeployer {
  commandProviders: (() => object[])[] = [];

  addCommandProvider(provider: () => object[]) {
    this.commandProviders.push(provider);
  }

  public deploy(options: { token: string; appId: string; guildId?: Snowflake }) {
    let commands = [];
    this.commandProviders.forEach(
      commandProvider => (commands = commands.concat(commandProvider())),
    );
    this.sendRequest(commands, options);
  }

  private async sendRequest(
    JSONCommands,
    options: { token: string; appId: string; guildId?: Snowflake },
  ) {
    console.log("Setting up " + JSONCommands.length + " commands for slash commands.");
    JSONCommands.forEach(element => {
      console.log(element);
    });
    const rest = new REST({ version: "9" }).setToken(options.token);
    try {
      console.log("Started refreshing application (/) commands.");
      if (options.guildId) {
        await rest.put(Routes.applicationGuildCommands(options.appId, options.guildId), {
          body: JSONCommands,
        });
      } else {
        await rest.put(Routes.applicationCommands(options.appId), {
          body: JSONCommands,
        });
      }

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  }
}
