import ImportHandler from "../../importer/ImportHandler";
import SubCommandHandler from "./CommandHandler";
import { MasterCommand } from "./MasterCommand";
import { SubCommand } from "./SubCommand";

export class SubCommandImportHandler implements ImportHandler<SubCommand<any>> {
  classToBeImported = SubCommand;
  constructor(public subCommandhandler: SubCommandHandler) {}
  onImport = (command: SubCommand<any>) => {
    this.subCommandhandler.setCommand(command.master + "/" + command.data.name, command);
  };
}

export class MasterCommandImportHandler implements ImportHandler<MasterCommand<any>> {
  classToBeImported = MasterCommand;
  constructor(public subCommandhandler: SubCommandHandler) {}
  onImport = (command: MasterCommand<any>) => {
    this.subCommandhandler.setMasterCommand(command.data.name, command);
  };
}
