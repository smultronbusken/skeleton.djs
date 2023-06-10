import { MessageComponentInteraction } from "discord.js";
import { Skeleton } from "../../Skeleton";
import { InteractionExecutableContainer } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";

@Importable
export class CustomIdCommand<T> extends InteractionExecutableContainer<T> {
  customId: string;
  constructor(
    customId: string,
    execute: (i: MessageComponentInteraction, context: T, skeleton: Skeleton<T>) => any,
  ) {
    super(execute);
    this.customId = customId;
  }
}
