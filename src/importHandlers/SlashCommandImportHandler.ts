import { CommandMediator } from "../commandHandlers/CommandMediator";
import { SlashCommand } from "../commandTypes/CommandTypes";
import ImportHandler from "./ImportHandler";

export class SlashCommandImportHandler<T> implements ImportHandler<SlashCommand<T>> {
  classToBeImported = SlashCommand;

  constructor(public mediator: CommandMediator<SlashCommand<T>>) {}

  onImport = (command: SlashCommand<T>) => {
    this.mediator.setCommand(command.data.name, command);
  };
}
