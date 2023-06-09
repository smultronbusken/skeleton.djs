import { ApplicationCommandOptionType } from "discord.js";
import { SubCommand } from "../../../implementations/SubCommand/SubCommand";
import { user } from "../../../builders/options";

export default new SubCommand<{}>(
  {
    master: "mastercommand",
    name: "sub",
    description: "yo",
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
  user({
    name: "user",
    description: "pings this user",
  }),
);
