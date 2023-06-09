import { APIApplicationCommandOption, ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../../../implementations/SlashCommand/Command";
import { default as o } from "../../../options";

export default new SlashCommand<{}>(
  {
    name: "another",
    description: "Another",
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
  o.string({
    name: "s",
    description: "A string option",
  }),
  o.integer({
    name: "n",
    description: "A int option",
  }),
);
