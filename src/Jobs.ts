import {
  CommandInteraction,
  APIContextMenuInteraction,
  ApplicationCommandOptionType,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
  APIApplicationCommand,
} from "discord.js";
import fg from "fast-glob";
import path from "path";
import "reflect-metadata";

export interface TConstructable<T> {
  new (...args: any[]): T;
  prototype: T;
}

export class JobRegistry {
  private onRegisterFunctions: Map<string, [(job: Job<any>) => void]> = new Map();
  private static metadataKey: string = "jobClass";

  /**
   * Imports all job files and registers them.
   */
  async loadAndRegister() {
    let jobs = await this.importJobsInFolder("**/*.job.(js|ts)", {
      ignore: ["node_modules"],
    });

    jobs.forEach((job: Job<any>) => {
      if (!job || !job.execute) return;
      this.registerJob(job);
    });
  }

  /**
   * Adds a function to be called when registering jobs.
   * @param func The function to be called when a Job of class T is registered.
   */
  onRegister<T extends Job<any>>(jobClass: TConstructable<T>, func: (job: T) => void) {
    let className = Reflect.getMetadata(
      JobRegistry.metadataKey,
      (<TConstructable<Job<any>>>jobClass).prototype,
    );
    let functions = this.onRegisterFunctions.get(className);
    if (functions) functions.push(<(job: Job<any>) => void>func);
    else this.onRegisterFunctions.set(className, [<(job: Job<any>) => void>func]);
  }

  /**
   * Registers an individual Job and calls all appropiate onRegister() functions.
   * If you want to register all imported jobs then use loadAndRegister()
   * @param job The job to be registered
   */
  registerJob(job: Job<any>) {
    let jobType;
    try {
      jobType = Reflect.getMetadata(JobRegistry.metadataKey, Reflect.getPrototypeOf(job));
    } catch (error) {
      return;
    }
    if (jobType === undefined) {
      console.log(job);
      throw new Error(
        "Job has no info about its type. Did you forget to put the JobClass decorator on its class?",
      );
    }
    this.onRegisterFunctions.get(jobType)?.forEach(func => {
      func(job);
    });
  }

  public static JobClass(constructor: Function) {
    Reflect.defineMetadata(JobRegistry.metadataKey, constructor.name, constructor.prototype);
  }

  /**
   * Imports the default export from the filepath whos name matches with the search string
   * The default export is expected to be a class extending T.
   */
  async importJobsInFolder(searchString: string, fgConfig: any = {}): Promise<Array<Job<any>>> {
    const entries = await fg(searchString, fgConfig);
    let jobs = [];
    for (const file of entries) {
      let jobClass: Job<any> = await this.importJob(path.join(process.cwd(), "" + file));
      jobs.push(jobClass);
    }
    return jobs;
  }

  /**
   * Imports the default export from the filepath
   * The default export is expected to be a class extending T.
   */
  async importJob(filePath: string): Promise<Job<any>> {
    console.log("Imported file: " + filePath.split("\\")[filePath.split("\\").length - 1]);
    let { default: jobClass } = await import(filePath);
    return jobClass;
  }
}

export class Job<T> {
  constructor(public execute: (interaction: any, app: T) => any) {}
}
