import { MessageContextMenuCommandInteraction, ApplicationCommandType, UserContextMenuCommandInteraction } from "discord.js";
import { JobRegistry } from "../Jobs";
import { CommandBase, CommandInput } from "../Command";
import JobRegister from "./JobRegister";
import { CommandMediator } from "../command/CommandMediator";
import RegistrationHandler from "./JobRegister";

  
export class UserCommandJobHandler<T> implements RegistrationHandler<UserCommand<T>> {
  
  jobType = UserCommand;
  
  constructor(public mediator: CommandMediator<UserCommand<T>>) {}

  onRegister = (job: UserCommand<T>) => {
      this.mediator.setCommand(job.data.name, job);
  }
}

export class MessageCommandJobHandler<T> implements RegistrationHandler<MessageCommand<T>> {

    jobType = MessageCommand;

    constructor(public mediator: CommandMediator<MessageCommand<T>>) {}

    onRegister = (job: MessageCommand<T>) => {
        this.mediator.setCommand(job.data.name, job);
    }
}


@JobRegistry.JobClass
export class MessageCommand<T> extends CommandBase<T> {
  constructor(
    input: Omit<CommandInput, "description">,
    execute: (interaction: MessageContextMenuCommandInteraction, app: T) => any,
  ) {
    super(
      {
        ...input,
        id: input.id,
        version: input.version,
        default_member_permissions: input.default_member_permissions,
        type: ApplicationCommandType.Message,
        application_id: "id",
        description: undefined,
      },
      execute,
    );
  }
}

@JobRegistry.JobClass
export class UserCommand<T> extends CommandBase<T> {
  constructor(
    input: Omit<CommandInput, "description">,
    execute: (interaction: UserContextMenuCommandInteraction, app: T) => any,
  ) {
    super(
      {
        ...input,
        id: input.id,
        version: input.version,
        default_member_permissions: input.default_member_permissions,
        type: ApplicationCommandType.User,
        application_id: "id",
        description: undefined,
      },
      execute,
    );
  }
}

export type ContextMenuCommand<T> = UserCommand<T> | MessageCommand<T>