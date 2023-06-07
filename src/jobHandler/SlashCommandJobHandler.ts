import { CommandInteraction, ApplicationCommandType } from "discord.js";
import { JobRegistry } from "../Jobs";
import { CommandMediator } from "../command/CommandMediator";
import { CommandBase, CommandInput } from "../Command";
import RegistrationHandler from "./JobRegister";


export class SlashCommandJobHandler<T> implements RegistrationHandler<SlashCommand<T>> {

    jobType = SlashCommand;

    constructor(public mediator: CommandMediator<SlashCommand<T>>) {}

    onRegister = (job: SlashCommand<T>) => {
        this.mediator.setCommand(job.data.name, job);
    }
}

@JobRegistry.JobClass
export class SlashCommand<T> extends CommandBase<T> {
  constructor(input: CommandInput, execute: (interaction: CommandInteraction, app: T) => void) {
    super(
      {
        ...input,
        id: input.id,
        version: input.version,
        default_member_permissions: input.default_member_permissions,
        type: ApplicationCommandType.ChatInput,
        application_id: "id",
      },
      execute,
    );
  }
}
