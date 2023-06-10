import { ComponentCommand } from "../../implementations/Component/Command";

export default new ComponentCommand<{}>("test", async (interaction, app) => {
  if (interaction.isRepliable()) interaction.reply("Button with id 'test' clicked!");
});
