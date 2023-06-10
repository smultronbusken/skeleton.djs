import { Mediator } from "../../command/Mediator";

import ImportHandler from "../../importer/ImportHandler";
import { UserCommand, MessageCommand } from "./Command";

export class UserCommandImportHandler implements ImportHandler<UserCommand> {
  classToBeImported = UserCommand;

  constructor(public mediator: Mediator<UserCommand>) {}

  onImport = (command: UserCommand) => {
    this.mediator.set(command.data.name, command);
  };
}

export class MessageCommandImportHandler implements ImportHandler<MessageCommand> {
  classToBeImported = MessageCommand;

  constructor(public mediator: Mediator<MessageCommand>) {}

  onImport = (command: MessageCommand) => {
    this.mediator.set(command.data.name, command);
  };
}
