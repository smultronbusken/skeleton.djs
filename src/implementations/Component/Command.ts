import { MessageComponentInteraction } from "discord.js";
import { Skeleton } from "../../Skeleton";
import { InteractionExecutableContainer } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";

@Importable
export class ComponentCommand extends InteractionExecutableContainer {
  customId: string;
  constructor(
    customId: string,
    execute: (i: MessageComponentInteraction, context: any, skeleton: Skeleton) => any,
  ) {
    super(execute);
    this.customId = customId;
  }
}
