import { Collection, APIApplicationCommand } from "discord.js";
import { CommandMediator } from "./CommandMediator";
import { ContextMenuCommand } from "../jobHandler/ContextMenuCommandJobHandler";
import { CommandToJSON } from "./CommandToJSON";
import { SlashCommand } from "../jobHandler/SlashCommandJobHandler";


export default class SlashCommandHandler<T> implements CommandMediator<SlashCommand<T>>, CommandToJSON  {

    private _commands: Collection<string, SlashCommand<T>> = new Collection();

    getCommands = () => Array.from(this._commands.values())

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