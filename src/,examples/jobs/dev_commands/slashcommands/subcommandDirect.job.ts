import { ApplicationCommandOptionType } from "discord.js";
import { SubCommand } from "../../../../command/SubCommandHandler";

export default new SubCommand<{}>(
  {
    master: "mastercommand",
    name: "sub",
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
