import { Collection, APIApplicationCommand } from "discord.js";
import { CommandMediator } from "../../command/CommandMediator";
import { APICommandProvider } from "../../deployer/APICommandProvider";
import { ContextMenuCommand } from "./Command";

export default class ContextMenuCommandHandler
  implements CommandMediator<ContextMenuCommand<any>>, APICommandProvider
{
  private _commands: Collection<string, ContextMenuCommand<any>> = new Collection();

  getCommands = () => Array.from(this._commands.values());

  getCommand = (id: string) => this._commands.get(id);

  setCommand = (id: string, command: ContextMenuCommand<any>) => this._commands.set(id, command);

  getAPICommands = () => {
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
