import { Collection, APIApplicationCommand } from "discord.js";
import { CommandMediator } from "../../command/CommandMediator";
import { SlashCommand } from "./Command";
import APICommandProvider from "../../deployer/APICommandProvider";

export default class SlashCommandHandler
  implements CommandMediator<SlashCommand<any>>, APICommandProvider
{
  private _commands: Collection<string, SlashCommand<any>> = new Collection();

  getCommands = () => Array.from(this._commands.values());

  getCommand = (id: string) => this._commands.get(id);

  setCommand = (id: string, command: SlashCommand<any>) => this._commands.set(id, command);

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
