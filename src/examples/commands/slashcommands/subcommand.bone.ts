import { ApplicationCommandOptionType } from "discord.js";
import { SubCommand } from "../../../implementations/SubCommand/SubCommand";
import { string, user } from "../../../builders/options";
export default new SubCommand<{}>(
  {
    master: "mastercommand",
    group: "group",
    name: "s",
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
