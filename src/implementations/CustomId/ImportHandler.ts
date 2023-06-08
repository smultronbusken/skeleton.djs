import { CommandMediator } from "../../command/CommandMediator";
import ImportHandler from "../../importer/ImportHandler";
import { CustomIdCommand } from "./Command";

export class CustomIdCommandImportHandler implements ImportHandler<CustomIdCommand<any>> {
  classToBeImported = CustomIdCommand;
  constructor(public mediator: CommandMediator<CustomIdCommand<any>>) {}
  onImport = (command: CustomIdCommand<any>) => {
    this.mediator.setCommand(command.customId, command);
  };
}
