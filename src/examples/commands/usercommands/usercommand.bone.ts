import { Message } from "discord.js";
import { UserCommand } from "../../../implementations/ContextMenuCommand/Command";

export default new UserCommand(
  {
    name: "user",
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
);
