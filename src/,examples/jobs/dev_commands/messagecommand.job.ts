import { MessageCommand } from "../../../jobHandler/ContextMenuCommandJobHandler";

export default new MessageCommand<{}>(
  {
    name: "message",
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
);
