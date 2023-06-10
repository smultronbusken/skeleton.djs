import { Mediator } from "../../command/Mediator";
import ImportHandler from "../../importer/ImportHandler";
import { SlashCommand } from "./Command";

export class SlashCommandImportHandler implements ImportHandler<SlashCommand> {
  classToBeImported = SlashCommand;

  constructor(public mediator: Mediator<SlashCommand>) {}

  onImport = (command: SlashCommand) => {
    this.mediator.set(command.data.name, command);
  };
}
