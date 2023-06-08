import SubCommandHandler from "../commandHandlers/SubCommandHandler";
import { SubCommand, MasterCommand } from "../commandTypes/CommandTypes";
import ImportHandler from "./ImportHandler";

export class SubCommandImportHandler<T> implements ImportHandler<SubCommand<T>> {
  classToBeImported = SubCommand;
  constructor(public subCommandhandler: SubCommandHandler<any>) {}
  onImport = (command: SubCommand<T>) => {
    this.subCommandhandler.setCommand(command.master + "/" + command.data.name, command);
  };
}

export class MasterCommandImportHandler<T> implements ImportHandler<MasterCommand<T>> {
  classToBeImported = MasterCommand;
  constructor(public subCommandhandler: SubCommandHandler<any>) {}
  onImport = (command: MasterCommand<T>) => {
    this.subCommandhandler.setMasterCommand(command.data.name, command);
  };
}
