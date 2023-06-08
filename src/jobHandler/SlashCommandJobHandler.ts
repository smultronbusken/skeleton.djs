import { CommandMediator } from "../command/CommandMediator";
import RegistrationHandler from "./JobRegister";
import { SlashCommand } from "../command/SlashCommandHandler";

export class SlashCommandJobHandler<T> implements RegistrationHandler<SlashCommand<T>> {
  jobType = SlashCommand;

  constructor(public mediator: CommandMediator<SlashCommand<T>>) {}

  onRegister = (job: SlashCommand<T>) => {
    this.mediator.setCommand(job.data.name, job);
  };
}
