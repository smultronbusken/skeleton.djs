import { CommandMediator } from "../commandHandlers/CommandMediator";
import { UserCommand, MessageCommand } from "../commandTypes/CommandTypes";
import ImportHandler from "./ImportHandler";

export class UserCommandImportHandler<T> implements ImportHandler<UserCommand<T>> {
  classToBeImported = UserCommand;

  constructor(public mediator: CommandMediator<UserCommand<T>>) {}

  onImport = (command: UserCommand<T>) => {
    this.mediator.setCommand(command.data.name, command);
  };
}

export class MessageCommandImportHandler<T> implements ImportHandler<MessageCommand<T>> {
  classToBeImported = MessageCommand;

  constructor(public mediator: CommandMediator<MessageCommand<T>>) {}

  onImport = (command: MessageCommand<T>) => {
    this.mediator.setCommand(command.data.name, command);
  };
}
