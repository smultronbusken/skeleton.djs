import {
  MessageContextMenuCommandInteraction,
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { CommandBase, CommandInput } from "../Command";
import JobRegister from "./JobRegister";
import { CommandMediator } from "../command/CommandMediator";
import RegistrationHandler from "./JobRegister";
import { UserCommand, MessageCommand } from "../command/ContextMenuCommandHandler";

export class UserCommandJobHandler<T> implements RegistrationHandler<UserCommand<T>> {
  jobType = UserCommand;

  constructor(public mediator: CommandMediator<UserCommand<T>>) {}

  onRegister = (job: UserCommand<T>) => {
    this.mediator.setCommand(job.data.name, job);
  };
}

export class MessageCommandJobHandler<T> implements RegistrationHandler<MessageCommand<T>> {
  jobType = MessageCommand;

  constructor(public mediator: CommandMediator<MessageCommand<T>>) {}

  onRegister = (job: MessageCommand<T>) => {
    this.mediator.setCommand(job.data.name, job);
  };
}
