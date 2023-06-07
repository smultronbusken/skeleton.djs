import { CustomIdCommand } from "../../jobHandler/CustomIdCommandJobHandler";

export default new CustomIdCommand<{}>("test", async (interaction, app) => {
  console.log("Pressed!");
});
