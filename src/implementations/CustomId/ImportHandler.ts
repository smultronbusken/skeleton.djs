import { Mediator } from "../../command/Mediator";
import ImportHandler from "../../importer/ImportHandler";
import { CustomIdCommand } from "./Command";

export class CustomIdCommandImportHandler implements ImportHandler<CustomIdCommand<any>> {
  classToBeImported = CustomIdCommand;
  constructor(public mediator: Mediator<CustomIdCommand<any>>) {}
  onImport = (command: CustomIdCommand<any>) => {
    this.mediator.set(command.customId, command);
  };
}
