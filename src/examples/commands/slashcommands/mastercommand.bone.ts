import { ApplicationCommandOptionType } from "discord.js";
import { MasterCommand } from "../../../implementations/SubCommand/MasterCommand";



export default new MasterCommand<{}>({
  description: "A master command",
  name: "mastercommand",
  options: [
    {
      description: "A group",
      name: "group",
      type: ApplicationCommandOptionType.SubcommandGroup,
    },
  ],
});
