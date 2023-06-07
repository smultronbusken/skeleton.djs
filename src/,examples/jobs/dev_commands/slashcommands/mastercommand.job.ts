import { ApplicationCommandOptionType } from "discord.js";
import { MasterCommand } from "../../../../jobHandler/SubCommandJobHandler";

export default new MasterCommand<{}>({
  description: "A master command",
  name: "mastercommand",
  options: [
    {
      description: "A group",
      name: "groupone",
      type: ApplicationCommandOptionType.SubcommandGroup,
    },
  ],
});
