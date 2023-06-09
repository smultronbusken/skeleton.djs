import { ApplicationCommandOptionType } from "discord.js";
import { MasterCommand } from "../../../implementations/SubCommand/MasterCommand";
import { group } from "../../../builders/options";

export default new MasterCommand<{}>(
  {
    description: "A master command",
    name: "mastercommand",
  },
  group({
    description: "A group",
    name: "group",
  }),
);
