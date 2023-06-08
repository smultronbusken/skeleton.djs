import { CommandMediator } from "../commandHandlers/CommandMediator";
import ImportHandler from "./ImportHandler";
import { CustomIdCommand } from "../commandHandlers/CustomIdCommandHandler";

export class CustomIdCommandImportHandler<T> implements ImportHandler<CustomIdCommand<T>> {
  classToBeImported = CustomIdCommand;
  constructor(public mediator: CommandMediator<CustomIdCommand<T>>) {}
  onImport = (command: CustomIdCommand<T>) => {
    this.mediator.setCommand(command.customId, command);
  };
}
