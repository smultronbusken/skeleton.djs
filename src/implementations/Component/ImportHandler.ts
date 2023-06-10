import { Mediator } from "../../command/Mediator";
import ImportHandler from "../../importer/ImportHandler";
import { ComponentCommand } from "./Command";

export class ComponentCommandImportHandler implements ImportHandler<ComponentCommand> {
  classToBeImported = ComponentCommand;
  constructor(public mediator: Mediator<ComponentCommand>) {}
  onImport = (command: ComponentCommand) => {
    this.mediator.set(command.customId, command);
  };
}
