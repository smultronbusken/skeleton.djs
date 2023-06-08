import { Collection } from "discord.js";
import { CommandMediator } from "../../command/CommandMediator";
import { CustomIdCommand } from "./Command";

export default class CustomIdCommandHandler implements CommandMediator<CustomIdCommand<any>> {
  private _commands: Collection<string, CustomIdCommand<any>> = new Collection();

  getCommands = () => Array.from(this._commands.values());

  getCommand = (id: string) => this._commands.get(id);

  setCommand = (id: string, command: CustomIdCommand<any>) => this._commands.set(id, command);
}
