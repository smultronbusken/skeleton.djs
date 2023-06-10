import { Mediator } from "../../command/Mediator";
import ImportHandler from "../../importer/ImportHandler";
import { SlashCommand } from "./Command";

export class SlashCommandImportHandler implements ImportHandler<SlashCommand<any>> {
  classToBeImported = SlashCommand;

  constructor(public mediator: Mediator<SlashCommand<any>>) {}

  onImport = (command: SlashCommand<any>) => {
    this.mediator.setCommand(command.data.name, command);
  };
}
