import { ApplicationCommandOptionType } from "discord.js";
import { SubCommand } from "../../../implementations/SubCommand/SubCommand";
import {default as o}  from "../../../options" 
export default new SubCommand<{}>(
  {
    master: "mastercommand",
    group: "group",
    name: "subcommand",
    description: "yo",
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
  o.user({
    name: "user",
    description: "pings this user",
  })
);
