import { ApplicationCommandOptionType } from "discord.js";
import { SubCommand } from "../../../../jobHandler/SubCommandJobHandler";

export default new SubCommand<{}>(
  {
    master: "mastercommand",
    group: "groupone",
    name: "subtwo",
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