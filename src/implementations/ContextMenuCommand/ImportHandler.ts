import { CommandMediator } from "../../command/CommandMediator";

import ImportHandler from "../../importer/ImportHandler";
import { UserCommand, MessageCommand } from "./Command";

export class UserCommandImportHandler implements ImportHandler<UserCommand<any>> {
  classToBeImported = UserCommand;

  constructor(public mediator: CommandMediator<UserCommand<any>>) {}

  onImport = (command: UserCommand<any>) => {
    this.mediator.setCommand(command.data.name, command);
  };
}

export class MessageCommandImportHandler implements ImportHandler<MessageCommand<any>> {
  classToBeImported = MessageCommand;

  constructor(public mediator: CommandMediator<MessageCommand<any>>) {}

  onImport = (command: MessageCommand<any>) => {
    this.mediator.setCommand(command.data.name, command);
  };
}
