import { ApplicationCommandOptionType } from "discord-api-types";
import { CommandInteraction, ContextMenuInteraction } from "discord.js";
import fg from "fast-glob";
import "reflect-metadata";

interface TConstructable<T> {
  new (...args): T;
  prototype: T;
}

export default class JobRegister {
  private onRegisterFunctions: Map<string, [(job: Job) => void]> = new Map();
  private static metadataKey: string = "jobClass";
  /**
   * Imports all job files and registers them.
   */
  async loadAndRegister(importUserJobs?: boolean, importDefaultJobs: boolean = false) {
    let defaultConstructors = [];
    let userConstructors = [];
    try {
      if (importUserJobs)
        userConstructors = await this.importConstructorsInFolder(
          "**/*.job.(js|ts)",
          { ignore: ["node_modules"] },
          "../../../",
        );
    } catch (ignore) {}
    if (importDefaultJobs) defaultConstructors = await this.getDefaultConstructors();
    let constructors = userConstructors.concat(defaultConstructors);
    constructors.forEach((job: Job) => {
      this.registerJob(job);
    });
  }

  /**
   * Adds a function to be called when registering jobs.
   * @param func The function to be called when a Job of class T is registered.
   */
  onRegister<T extends Job>(jobClass: TConstructable<T>, func: (job: T) => void) {
    let className = Reflect.getMetadata(
      JobRegister.metadataKey,
      (<TConstructable<Job>>jobClass).prototype,
    );
    let functions = this.onRegisterFunctions.get(className);
    if (functions) functions.push(<(job: Job) => void>func);
    else this.onRegisterFunctions.set(className, [<(job: Job) => void>func]);
  }

  /**
   * Registers an individual Job and calls all appropiate onRegister() functions.
   * If you want to register all imported jobs then use loadAndRegister()
   * @param job The job to be registered
   */
  registerJob(job: Job) {
    let jobType = Reflect.getMetadata(JobRegister.metadataKey, Reflect.getPrototypeOf(job));

    if (jobType === undefined) {
      throw new Error(
        job.name +
          " has no info about its type. Did you forget to put the JobClass decorator on its class?",
      );
    }
    this.onRegisterFunctions.get(jobType)?.forEach(func => {
      func(job);
    });
  }

  private async getDefaultConstructors(): Promise<Job[]> {
    let messagecommand = await this.importConstructor(
      "../data/jobs/dev_commands/messagecommand.job",
    );
    let usercommand = await this.importConstructor("../data/jobs/dev_commands/usercommand.job");
    let sub = await this.importConstructor("../data/jobs/dev_commands/subcommand.job");
    let master = await this.importConstructor("../data/jobs/dev_commands/mastercommand.job");

    let constructors: Job[] = [messagecommand, usercommand, sub, master];
    return constructors;
  }

  /**
   * Decorator for marking classes as job classes. It adds meta data to the class which is used internally for easier type inference.
   */
  public static JobClass(constructor: Function) {
    Reflect.defineMetadata(JobRegister.metadataKey, constructor.name, constructor.prototype);
  }

  /**
   * Imports the default export from the filepath whos name matches with the search string
   * The default export is expected to be a class extending T.
   */
  async importConstructorsInFolder(
    searchString: string,
    fgConfig: any = {},
    importPrefix: string = "",
  ): Promise<Array<Job>> {
    const entries = await fg(searchString, fgConfig);
    let jobs = [];
    for (const file of entries) {
      let jobClass: Job = await this.importConstructor(importPrefix + file);
      jobs.push(jobClass);
    }
    return jobs;
  }

  /**
   * Imports the default export from the filepath
   * The default export is expected to be a class extending T.
   */
  async importConstructor(filePath: string): Promise<Job> {
    let { default: jobClass } = await import(filePath);
    return jobClass;
  }
}

export const CommandOptionType = {
  Boolean: ApplicationCommandOptionType.Boolean,
  Channel: ApplicationCommandOptionType.Channel,
  Integer: ApplicationCommandOptionType.Integer,
  Mentionable: ApplicationCommandOptionType.Mentionable,
  Number: ApplicationCommandOptionType.Number,
  Role: ApplicationCommandOptionType.Role,
  String: ApplicationCommandOptionType.String,
  User: ApplicationCommandOptionType.User,
} as const;
type CommandOptionType = typeof CommandOptionType[keyof typeof CommandOptionType];

export interface CommandOptionChoice {
  name: string;
  value: any;
}

export interface CommandOption {
  name: string;
  type: CommandOptionType;
  description: string;
  required: boolean;
  choices?: CommandOptionChoice[];
}

export interface CommandOptionData {
  name: string;
  description: string;
  required: boolean;
}

export enum CommandType {
  Slash = 1,
  User = 2,
  Message = 3,
}

export interface JobInput extends Job {}
export class Job {
  name: string;
  info: string;
  hidden?: boolean;
  constructor(input: JobInput) {
    this.name = input.name;
    this.info = input.info;
    this.hidden = input.hidden;
  }
}

export abstract class CommandBase<T> extends Job {
  abstract execute?: (interaction: any, app: T) => any;
  abstract type: CommandType;
}

export interface SlashCommandBaseInput<T> extends JobInput {
  options?: Array<CommandOption>;
  execute?: (interaction: CommandInteraction, app: T) => void;
}
export abstract class SlashCommandBase<T> extends CommandBase<T> {
  options?: Array<CommandOption>;
  execute?: (interaction: CommandInteraction, app: T) => void;
  type = CommandType.Slash;
  constructor(input: SlashCommandBaseInput<T>) {
    super(input);
    this.options = input.options;
    this.execute = input.execute;
  }
}

export interface ContextMenuCommandInput<T> {
  name: string;
  execute?: (interaction: ContextMenuInteraction, app: T) => void;
}

@JobRegister.JobClass
export class MessageCommand<T> extends CommandBase<T> {
  type = CommandType.Message;
  execute?: (interaction: ContextMenuInteraction, app: T) => void;
  constructor(input: ContextMenuCommandInput<T>) {
    super({
      info: undefined,
      name: input.name,
    });
    this.execute = input.execute;
  }
}

@JobRegister.JobClass
export class UserCommand<T> extends CommandBase<T> {
  type = CommandType.User;
  execute?: (interaction: ContextMenuInteraction, app: T) => void;
  constructor(input: ContextMenuCommandInput<T>) {
    super({
      info: undefined,
      name: input.name,
    });
    this.execute = input.execute;
  }
}

@JobRegister.JobClass
export class SlashCommand<T> extends SlashCommandBase<T> {
  constructor(input: SlashCommandBaseInput<T>) {
    super(input);
  }
}

export interface SubCommandBaseInput<T> extends SlashCommandBaseInput<T> {
  masterCommand: string;
}
@JobRegister.JobClass
export class SubCommand<T> extends SlashCommandBase<T> {
  masterCommand: string;
  hidden? = true;
  constructor(input: SubCommandBaseInput<T>) {
    super(input);
    this.masterCommand = input.masterCommand;
  }
}
