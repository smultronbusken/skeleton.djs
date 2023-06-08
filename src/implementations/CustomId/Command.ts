import { InteractionExecutable } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";
import { CustomIdInteraction } from "./InteractionHandler";

@Importable
export class CustomIdCommand<T> extends InteractionExecutable<T> {
  customId: string;
  constructor(customId: string, execute: (i: CustomIdInteraction, context: T) => any) {
    super(execute);
    this.customId = customId;
  }
}
