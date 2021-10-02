import { Intents } from "discord.js";
import path from "path";
import Skeleton from "./Skeleton";

if (require.main === module) {
  import(path.join(process.cwd(), 'app-config.json')).then(config => {
    const intents = { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] }
    const skeleton = new Skeleton(
      {}, 
      config["APP_PRIVATE_KEY"],
      config["APP_TOKEN"],
      intents,
      config["DEV_GUILD_ID"]
    );
    skeleton.client.login("ODMyNzM0OTk4OTYzNDIxMjE0.YHoG5w.GKZv2rxLt-P1ZhCU5nGG_LJUpj0");
  })
}