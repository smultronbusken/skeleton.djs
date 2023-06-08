import { CustomIdCommand } from "../../command/CustomIdCommandHandler";

export default new CustomIdCommand<{}>("test", async (interaction, app) => {
  if (interaction.isRepliable()) interaction.reply("Button with id 'test' clicked!");
});
