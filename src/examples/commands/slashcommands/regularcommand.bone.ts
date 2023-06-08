import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../../../implementations/SlashCommand/Command";

export default new SlashCommand<{}>(
  {
    name: "another",
    description: "Another",
    options: [
      {
        name: "option",
        description: "A option",
        type: ApplicationCommandOptionType.String,
      },
    ],
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
);
