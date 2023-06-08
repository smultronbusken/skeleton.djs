import { GatewayIntentBits, Client } from "discord.js";
import path from "path";
import { Skeleton } from "./Skeleton";
import { SlashCommand } from "./commandHandlers/SlashCommandHandler";

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
    client.login(config["APP_TOKEN"]);

    // Create the object
    const skeleton = new Skeleton();

    // Set what will be passed to commands when executed
    skeleton.setContext({});

    // Manually add a command, instead of writing it in a .job.ts file
    skeleton.addSlashCommand(
      new SlashCommand<{}>(
        {
          name: "testcommand",
          description: "I added this manually",
        },
        async (interaction, context) => {
          interaction.reply("hej");
        },
      ),
    );

    // This loads all command files and deploys them
    skeleton.run({
      appId: config["APP_ID"],
      client: client,
      token: config["APP_TOKEN"],
      guildId: config["DEV_GUILD_ID"], // Optional, if youre using a dev guild.
    });
  });
}
