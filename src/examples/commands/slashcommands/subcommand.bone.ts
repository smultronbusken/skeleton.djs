import { ApplicationCommandOptionType } from "discord.js";
import { SubCommand } from "../../../implementations/SubCommand/SubCommand";

export default new SubCommand<{}>(
  {
    master: "mastercommand",
    group: "group",
    name: "subcommand",
    description: "yo",
    options: [
      {
        name: "user",
        description: "pings this user",
        type: ApplicationCommandOptionType.User,
      },
    ],
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
);
