import {
  Collection,
  APIApplicationCommand,
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { CommandMediator } from "./CommandMediator";
import { CommandToJSON } from "./CommandToJSON";
import { Importable } from "../Importer";
import { ContextMenuCommand } from "../commandTypes/CommandTypes";

export default class ContextMenuCommandHandler<T>
  implements CommandMediator<ContextMenuCommand<T>>, CommandToJSON
{
  private _commands: Collection<string, ContextMenuCommand<T>> = new Collection();

  getCommands = () => Array.from(this._commands.values());

  getCommand = (id: string) => this._commands.get(id);

  setCommand = (id: string, command: ContextMenuCommand<T>) => this._commands.set(id, command);

  convertCommandsToJSON = () => {
    const commandsAsJson: APIApplicationCommand[] = [];
    this._commands.forEach(c => {
      commandsAsJson.push({
        ...c.data,
        //options: c.commandStructure.options.map(option => option.toJSON()),
      });
    });
    return commandsAsJson;
  };
}

