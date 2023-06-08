import {
  Collection,
  APIApplicationCommand,
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { CommandMediator } from "./CommandMediator";
import { CommandToJSON } from "./CommandToJSON";
import { CommandBase, CommandInput } from "../Command";
import { Importable } from "../Importer";

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

@Importable
export class MessageCommand<T> extends CommandBase<T> {
  constructor(
    input: Omit<CommandInput, "description">,
    execute: (interaction: MessageContextMenuCommandInteraction, app: T) => any,
  ) {
    super(
      {
        ...input,
        id: input.id,
        version: input.version,
        default_member_permissions: input.default_member_permissions,
        type: ApplicationCommandType.Message,
        application_id: "id",
        description: undefined,
      },
      execute,
    );
  }
}

@Importable
export class UserCommand<T> extends CommandBase<T> {
  constructor(
    input: Omit<CommandInput, "description">,
    execute: (interaction: UserContextMenuCommandInteraction, app: T) => any,
  ) {
    super(
      {
        ...input,
        id: input.id,
        version: input.version,
        default_member_permissions: input.default_member_permissions,
        type: ApplicationCommandType.User,
        application_id: "id",
        description: undefined,
      },
      execute,
    );
  }
}

export type ContextMenuCommand<T> = UserCommand<T> | MessageCommand<T>;
