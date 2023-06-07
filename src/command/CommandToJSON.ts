import { APIApplicationCommand } from "discord.js";

export interface CommandToJSON {
    convertCommandsToJSON: () => APIApplicationCommand[]
}