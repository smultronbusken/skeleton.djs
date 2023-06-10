import { Mediator } from "../../command/Mediator";
import ImportHandler from "../../importer/ImportHandler";
import { ComponentCommand } from "./Command";

export class ComponentCommandImportHandler implements ImportHandler<ComponentCommand<any>> {
  classToBeImported = ComponentCommand;
  constructor(public mediator: Mediator<ComponentCommand<any>>) {}
  onImport = (command: ComponentCommand<any>) => {
    this.mediator.set(command.customId, command);
  };
}
