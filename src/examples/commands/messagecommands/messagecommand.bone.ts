import { MessageCommand } from "../../../implementations/ContextMenuCommand/Command";


export default new MessageCommand<{}>(
  {
    name: "message",
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
);
