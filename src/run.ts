import { GatewayIntentBits, Client } from "discord.js";
import path from "path";
import { SlashCommand, UserCommand, string } from "./main";
import { Skeleton } from "./Skeleton";

if (require.main === module) {
  import(path.join(process.cwd(), "app-config.json")).then(config => {
    const clientOptions = {
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
      ],
    };
    const client = new Client(clientOptions);

    // Create the object
    const skeleton = new Skeleton();

    // Set what will be passed to commands when executed
    skeleton.setContext({});

    // This loads all command files and deploys them
    skeleton.run({
      appId: config["APP_ID"],
      token: config["APP_TOKEN"],
      guildId: config["DEV_GUILD_ID"], // Optional, if youre using a dev guild.
      client,
    });
  });
}
