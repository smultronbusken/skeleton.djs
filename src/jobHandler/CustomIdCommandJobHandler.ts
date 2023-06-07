import { BaseInteraction, Interaction } from "discord.js";
import { JobRegistry, Job } from "../Jobs";
import { CommandMediator } from "../command/CommandMediator";

import RegistrationHandler from "./JobRegister";

export class CustomIdCommandJobHandler<T> implements RegistrationHandler<CustomIdCommand<T>> {
    jobType = CustomIdCommand;
    constructor(public mediator: CommandMediator<CustomIdCommand<T>>) {}
    onRegister = (job: CustomIdCommand<T>) => {
        this.mediator.setCommand(job.customId, job);
    }
}

export type CustomIdInteraction = Interaction & { customId: string };

export function isCustomInteraction(obj: unknown): obj is CustomIdInteraction {
  return (
    obj instanceof BaseInteraction &&
    obj !== null &&
    "customId" in obj &&
    typeof (obj as any).customId === "string"
  );
}

@JobRegistry.JobClass
export class CustomIdCommand<T> extends Job<T> {
  customId: string;
  constructor(customId: string, execute: (i: CustomIdInteraction, context: T) => any) {
    super(execute);
    this.customId = customId;
  }
}



