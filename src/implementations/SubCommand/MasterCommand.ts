import { CommandInput } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";
import { SlashCommand } from "../SlashCommand/Command";

@Importable
export class MasterCommand<T> extends SlashCommand<T> {
  constructor(input: CommandInput) {
    super(input, () => {});
  }
}