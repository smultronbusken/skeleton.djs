
import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { JobRegistry } from "../Jobs";
import { CommandMediator } from "../command/CommandMediator";
import { SubcommandBase, SubcommandInput, CommandInput } from "../Command";
import RegistrationHandler from "./JobRegister";
import SubCommandHandler, { SubCommand, MasterCommand } from "../command/SubCommandHandler";

export class SubCommandJobHandler<T> implements RegistrationHandler<SubCommand<T>> {
    jobType = SubCommand;
    constructor(public mediator: CommandMediator<SubCommand<T>>) {}
    onRegister = (job: SubCommand<T>) => {
        this.mediator.setCommand(job.master + "/" + job.data.name, job);
    }
}

export class MasterCommandJobHandler<T> implements RegistrationHandler<MasterCommand<T>> {
    jobType = MasterCommand;
    constructor(public subCommandhandler: SubCommandHandler<any>) {}
    onRegister = (job: MasterCommand<T>) => {
        this.subCommandhandler.setMasterCommand(job.data.name, job);
    }
}