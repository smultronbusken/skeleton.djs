import { UserCommand } from "../../../jobHandler/ContextMenuCommandJobHandler";

export default new UserCommand<{}>(
  {
    name: "user",
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
);
