import { APIApplicationCommand, Collection } from "discord.js";
import { CommandMediator } from "./CommandMediator";
import { CommandToJSON } from "./CommandToJSON";
import { CustomIdInteraction } from "../interactionHandlers/CustomIdInteractionHandler";
import {  Importable } from "../Importer";
import { Executable } from "../commandTypes/CommandTypes";



export default class CustomIdCommandHandler<T> implements CommandMediator<CustomIdCommand<T>> {
  private _commands: Collection<string, CustomIdCommand<T>> = new Collection();

  getCommands = () => Array.from(this._commands.values());

  getCommand = (id: string) => this._commands.get(id);

  setCommand = (id: string, command: CustomIdCommand<T>) => this._commands.set(id, command);
}

@Importable
export class CustomIdCommand<T> extends Executable<T> {
  customId: string;
  constructor(customId: string, execute: (i: CustomIdInteraction, context: T) => any) {
    super(execute);
    this.customId = customId;
  }
}
