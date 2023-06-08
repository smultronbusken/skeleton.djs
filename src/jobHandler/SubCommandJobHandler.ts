import RegistrationHandler from "./JobRegister";
import SubCommandHandler, { SubCommand, MasterCommand } from "../command/SubCommandHandler";

export class SubCommandJobHandler<T> implements RegistrationHandler<SubCommand<T>> {
  jobType = SubCommand;
  constructor(public subCommandhandler: SubCommandHandler<any>) {}
  onRegister = (job: SubCommand<T>) => {
    this.subCommandhandler.setCommand(job.master + "/" + job.data.name, job);
  };
}

export class MasterCommandJobHandler<T> implements RegistrationHandler<MasterCommand<T>> {
  jobType = MasterCommand;
  constructor(public subCommandhandler: SubCommandHandler<any>) {}
  onRegister = (job: MasterCommand<T>) => {
    this.subCommandhandler.setMasterCommand(job.data.name, job);
  };
}
