import { APIApplicationCommandOption } from "discord.js";
import { CommandInput } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";
import { SlashCommand } from "../SlashCommand/Command";

@Importable
export class MasterCommand<T> extends SlashCommand<T> {
  constructor(input:  Omit<CommandInput, "options">, ...options: APIApplicationCommandOption[]) {
    super(input, () => {}, ...options);
  }
}
