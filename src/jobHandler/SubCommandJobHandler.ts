
import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { JobRegistry } from "../Jobs";
import { CommandMediator } from "../command/CommandMediator";
import { SubcommandBase, SubcommandInput, CommandInput } from "../Command";
import RegistrationHandler from "./JobRegister";
import { SlashCommand } from "./SlashCommandJobHandler";
import SubCommandHandler from "../command/SubCommandHandler";

export class SubCommandJobHandler<T> implements RegistrationHandler<SubCommand<T>> {
    jobType = SubCommand;
    constructor(public mediator: CommandMediator<SubCommand<T>>) {}
    onRegister = (job: SubCommand<T>) => {
        this.mediator.setCommand(job.master + "/" + job.data.name, job);
    }
}

@JobRegistry.JobClass
export class SubCommand<T> extends SubcommandBase<T> {
  master: string;
  group: string;
  constructor(
    input: SubcommandInput & { master: string; group?: string },
    execute: (interaction: CommandInteraction, app: T) => void,
  ) {
    super(
      {
        ...input,
        type: ApplicationCommandOptionType.Subcommand,
      },
      execute,
    );
    this.master = input.master;
    this.group = input.group;
  }
}

export class MasterCommandJobHandler<T> implements RegistrationHandler<MasterCommand<T>> {
    jobType = MasterCommand;
    constructor(public subCommandhandler: SubCommandHandler<any>) {}
    onRegister = (job: MasterCommand<T>) => {
        this.subCommandhandler.addMasterCommand(job.data.name, job);
    }
}

@JobRegistry.JobClass
export class MasterCommand<T> extends SlashCommand<T> {
  constructor(input: CommandInput) {
    super(input, () => {});
  }
}

