import { APIApplicationCommand } from "discord.js";

export interface APICommandProvider {
  getAPICommands: () => APIApplicationCommand[];
}
