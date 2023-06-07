import { MessageCommand } from "../../../jobs/ContextMenu";

export default new MessageCommand<{}>(
  {
    name: "message",
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
);
