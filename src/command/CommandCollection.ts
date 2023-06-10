import { Collection, APIApplicationCommand } from "discord.js";
import APICommandProvider from "../deployer/APICommandProvider";
import { CommandBase, ContextMenuCommand } from "../main";
import { Mediator } from "./Mediator";

export default class CommandMediator<T extends CommandBase<any>>
  implements Mediator<T>, APICommandProvider
{
  private _commands: Collection<string, T> = new Collection();

  getCommands = () => Array.from(this._commands.values());

  getCommand = (id: string) => this._commands.get(id);

  setCommand = (id: string, command: T) => this._commands.set(id, command);

  getAPICommands = () => {
    const commandsAsJson: APIApplicationCommand[] = [];
    this._commands.forEach(c => {
      commandsAsJson.push({
        ...c.data,
      });
    });
    return commandsAsJson;
  };
}
