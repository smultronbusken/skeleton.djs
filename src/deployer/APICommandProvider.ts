import { APIApplicationCommand } from "discord.js";

export default interface APICommandProvider {
  getAPICommands: () => APIApplicationCommand[];
}
