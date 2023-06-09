import { ApplicationCommandOptionType } from "discord.js";
import { MasterCommand } from "../../../implementations/SubCommand/MasterCommand";
import {default as o} from "../../../options";

export default new MasterCommand<{}>({
    description: "A master command",
    name: "mastercommand",
  },
  o.group({
    description: "A group",
    name: "group",
  })
);
