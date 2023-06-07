import { CustomIdCommand } from "../../jobs/CustomId";

export default new CustomIdCommand<{}>("test", async (interaction, app) => {
  console.log("Pressed!");
});
