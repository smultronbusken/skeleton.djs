import { Collection, APIApplicationCommand, ApplicationCommandType, CommandInteraction } from "discord.js";
import { CommandMediator } from "./CommandMediator";
import { CommandToJSON } from "./CommandToJSON";
import { CommandBase, CommandInput } from "../Command";
import { JobRegistry } from "../Jobs";


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


@JobRegistry.JobClass
export class SlashCommand<T> extends CommandBase<T> {
  constructor(input: CommandInput, execute: (interaction: CommandInteraction, app: T) => void) {
    super(
      {
        ...input,
        id: input.id,
        version: input.version,
        default_member_permissions: input.default_member_permissions,
        type: ApplicationCommandType.ChatInput,
        application_id: "id",
      },
      execute,
    );
  }
}
