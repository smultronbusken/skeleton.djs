import { GatewayIntentBits } from "discord.js";
import path from "path";
import { Skeleton } from "./Skeleton";

export * from "./Skeleton";
export * from "./Jobs";
export * from "./CommandRegistration";

if (require.main === module) {
  import(path.join(process.cwd(), "app-config.json")).then(config => {
    const intents = {
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
      ],
    };
    const skeleton = new Skeleton(
      {},
      config["APP_TOKEN"],
      config["APP_ID"],
      intents,
      config["DEV_GUILD_ID"],
    );
    skeleton.client.login(config["APP_TOKEN"]);
  });
}
