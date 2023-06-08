import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { SlashCommand } from "../../command/SlashCommandHandler";

export default new SlashCommand<{}>(
  {
    name: "cazi",
    description: "bongi",
    options: [
      {
        name: "option",
        description: "how much",
        type: ApplicationCommandOptionType.User,
      },
    ],
  },

  async (interaction, app) => {
    let button = new ButtonBuilder()
      .setCustomId("test")
      .setLabel("Join this faction")
      .setStyle(ButtonStyle.Success);

    let row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    interaction.reply({ components: [row] });
  },
);
