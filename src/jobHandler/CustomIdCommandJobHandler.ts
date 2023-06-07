import { BaseInteraction, Interaction } from "discord.js";
import { JobRegistry, Job } from "../Jobs";
import { CommandMediator } from "../command/CommandMediator";

import RegistrationHandler from "./JobRegister";
import { CustomIdCommand } from "../command/CustomIdCommandHandler";

export class CustomIdCommandJobHandler<T> implements RegistrationHandler<CustomIdCommand<T>> {
  jobType = CustomIdCommand;
  constructor(public mediator: CommandMediator<CustomIdCommand<T>>) {}
  onRegister = (job: CustomIdCommand<T>) => {
    this.mediator.setCommand(job.customId, job);
  };
}
