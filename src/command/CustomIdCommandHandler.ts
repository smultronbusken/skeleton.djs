import { APIApplicationCommand, Collection } from "discord.js";
import { CommandMediator } from "./CommandMediator";
import { CommandToJSON } from "./CommandToJSON";
import { JobRegistry, Job } from "../Jobs";
import { CustomIdInteraction } from "../interactionHandlers/CustomIdInteractionHandler";

export default class CustomIdCommandHandler<T> implements CommandMediator<CustomIdCommand<T>>  {

    private _commands: Collection<string, CustomIdCommand<T>> = new Collection();

    getCommands = () => Array.from(this._commands.values())

    getCommand = (id: string) => this._commands.get(id);

    setCommand = (id: string, command: CustomIdCommand<T>) => this._commands.set(id, command);
}

@JobRegistry.JobClass
export class CustomIdCommand<T> extends Job<T> {
  customId: string;
  constructor(customId: string, execute: (i: CustomIdInteraction, context: T) => any) {
    super(execute);
    this.customId = customId;
  }
}