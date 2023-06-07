import { Collection, APIApplicationCommand } from "discord.js";
import { CommandMediator } from "./CommandMediator";
import { ContextMenuCommand } from "../jobHandler/ContextMenuCommandJobHandler";
import { CommandToJSON } from "./CommandToJSON";

export default class ContextMenuCommandHandler<T> implements CommandMediator<ContextMenuCommand<T>>, CommandToJSON  {

    private _commands: Collection<string, ContextMenuCommand<T>> = new Collection();

    getCommands = () => Array.from(this._commands.values())

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