import { UserCommand } from "../../../command/ContextMenuCommandHandler";

export default new UserCommand<{}>(
  {
    name: "user",
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
);
