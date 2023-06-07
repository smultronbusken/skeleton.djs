import { UserCommand } from "../../../jobs/ContextMenu";

export default new UserCommand<{}>(
  {
    name: "user",
  },
  async (interaction, app) => {
    interaction.reply("Hi.");
  },
);
