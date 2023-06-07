import { APIApplicationCommand, Collection } from "discord.js";
import { CustomIdCommand } from "../jobHandler/CustomIdCommandJobHandler";
import { CommandMediator } from "./CommandMediator";
import { CommandToJSON } from "./CommandToJSON";

export default class CustomIdCommandHandler<T> implements CommandMediator<CustomIdCommand<T>>  {

    private _commands: Collection<string, CustomIdCommand<T>> = new Collection();

    getCommands = () => Array.from(this._commands.values())

    getCommand = (id: string) => this._commands.get(id);

    setCommand = (id: string, command: CustomIdCommand<T>) => this._commands.set(id, command);

}