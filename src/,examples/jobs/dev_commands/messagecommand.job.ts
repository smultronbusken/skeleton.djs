import { MessageCommand } from "../../../command/ContextMenuCommandHandler";

export default new MessageCommand<{}>(
  {
    name: "message",
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
);
