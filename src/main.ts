import {
  Client,
  GatewayIntentBits,
} from "discord.js";
import path from "path";
import { Skeleton } from "./Skeleton";

export * from "./Skeleton";

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
    /*skeleton.addCommand(
      new SlashCommand<{}>({
        name: "manuallyadded",
        description: "Lmao",
        async execute(interaction, context) {
          
        },
      }),
    );*/

    // Loads all .job.ts files and registers them.
    skeleton.run({
      appId: config["APP_ID"],
      client: client,
      token: config["APP_TOKEN"],
      guildId: config["DEV_GUILD_ID"],
    });
  });
}
