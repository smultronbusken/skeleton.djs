import {
  ChatInputCommandInteraction,
  Client,
  CommandInteraction,
  ContextMenuCommandInteraction,
  GatewayIntentBits,
} from "discord.js";
import path from "path";
import { Skeleton } from "./Skeleton";
import CustomIdInteractionHandler from "./jobs/CustomId";
import { SlashCommandHandler } from "./jobs/SlashCommand";
import { ContextMenuHandler } from "./jobs/ContextMenu";
import { SubcommandHandler } from "./jobs/SubCommand";

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

    let handler = new CustomIdInteractionHandler<{}>();
    skeleton.onRegister(handler.CustomIdOnRegister.type, handler.CustomIdOnRegister.func);
    skeleton.registerInteractionHandler(handler.handler);

    let slashHandler = new SlashCommandHandler<{}>();
    skeleton.onRegister(slashHandler.onRegister.type, slashHandler.onRegister.func);
    skeleton.registerInteractionHandler(slashHandler.handler);
    skeleton.addCommandProvider(() => slashHandler.convertCommandsToJSON());

    let subHandler = new SubcommandHandler<{}>();
    skeleton.onRegister(subHandler.onRegisterSub.type, subHandler.onRegisterSub.func);
    skeleton.onRegister(subHandler.onRegisterMaster.type, subHandler.onRegisterMaster.func);
    skeleton.registerInteractionHandler(subHandler.handler);
    skeleton.addCommandProvider(() => subHandler.convertCommandsToJSON());

    let constextMenuHandler = new ContextMenuHandler<{}>();
    skeleton.onRegister(
      constextMenuHandler.messageContextMenuRegister.type,
      constextMenuHandler.messageContextMenuRegister.func,
    );
    skeleton.onRegister(
      constextMenuHandler.userContextMenuRegister.type,
      constextMenuHandler.userContextMenuRegister.func,
    );
    skeleton.registerInteractionHandler(constextMenuHandler.handler);
    skeleton.addCommandProvider(() => constextMenuHandler.convertCommandsToJSON());

    // Loads all .job.ts files and registers them.
    skeleton.run({
      appId: config["APP_ID"],
      client: client,
      token: config["APP_TOKEN"],
      guildId: config["DEV_GUILD_ID"],
    });
  });
}
