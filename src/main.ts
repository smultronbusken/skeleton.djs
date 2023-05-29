import { Intents } from "discord.js";
import path from "path";
import { Skeleton } from "./Skeleton";

export * from "./Skeleton";
export * from "./Jobs";
export * from "./CommandRegistration";

if (require.main === module) {
  import(path.join(process.cwd(), "app-config.json")).then(config => {
    const intents = {
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
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
