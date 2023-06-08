import { Collection, APIApplicationCommand } from "discord.js";
import { SlashCommand } from "../commandTypes/CommandTypes";
import { CommandMediator } from "./CommandMediator";
import { CommandToJSON } from "./CommandToJSON";

export default class SlashCommandHandler<T>
  implements CommandMediator<SlashCommand<T>>, CommandToJSON
{
  private _commands: Collection<string, SlashCommand<T>> = new Collection();

  getCommands = () => Array.from(this._commands.values());

  getCommand = (id: string) => this._commands.get(id);

  setCommand = (id: string, command: SlashCommand<T>) => this._commands.set(id, command);

  convertCommandsToJSON = () => {
    const commandsAsJson: APIApplicationCommand[] = [];
    this._commands.forEach(c => {
      commandsAsJson.push({
        ...c.data,
      });
    });
    return commandsAsJson;
  };
}
