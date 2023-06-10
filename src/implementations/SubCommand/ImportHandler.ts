import ImportHandler from "../../importer/ImportHandler";
import SubCommandHandler from "./CommandHandler";
import { MasterCommand } from "./MasterCommand";
import { SubCommand } from "./SubCommand";

export class SubCommandImportHandler implements ImportHandler<SubCommand> {
  classToBeImported = SubCommand;
  constructor(public subCommandhandler: SubCommandHandler) {}
  onImport = (command: SubCommand) => {
    this.subCommandhandler.set(command.master + "/" + command.data.name, command);
  };
}

export class MasterCommandImportHandler implements ImportHandler<MasterCommand> {
  classToBeImported = MasterCommand;
  constructor(public subCommandhandler: SubCommandHandler) {}
  onImport = (command: MasterCommand) => {
    this.subCommandhandler.setMasterCommand(command.data.name, command);
  };
}
