import {
  Collection,
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
  APIApplicationCommandSubcommandGroupOption,
} from "discord.js";
import { Mediator } from "../../command/Mediator";
import APICommandProvider from "../../deployer/APICommandProvider";
import { MasterCommand } from "./MasterCommand";
import { SubCommand } from "./SubCommand";

/**
 * Class representing a handler for sub-commands. Implements CommandMediator and APICommandProvider interfaces.
 */
export default class SubCommandHandler implements Mediator<SubCommand>, APICommandProvider {
  private subCommands: Collection<string, SubCommand> = new Collection();
  private masterCommands: Collection<string, MasterCommand> = new Collection();

  getAll = () => Array.from(this.subCommands.values());

  get = (id: string) => this.subCommands.get(id);

  set = (id: string, command: SubCommand) => {
    this.subCommands.set(id, command);
  };

  setMasterCommand = (id: string, command: MasterCommand) => {
    this.masterCommands.set(id, command);
  };

  getAPICommands() {
    const commandsAsJson = [];

    // Iterate over each master command
    for (const c of this.masterCommands.values()) {
      let options: APIApplicationCommandOption[] = [];
      let subCommands = this.subCommands.filter(sc => sc.master === c.data.name);

      subCommands.forEach(sc => {
        if (sc.group) {
          // Find the group option associated with the sub-command
          let groupOption = c.data.options.find(option => {
            return (
              option.type === ApplicationCommandOptionType.SubcommandGroup &&
              option.name == sc.group
            );
          }) as APIApplicationCommandSubcommandGroupOption;
          if (!groupOption) throw new Error(`Subcommand group ${sc.group} does not exist.`);

          // If the group option does not have any options, initialize an empty array
          if (!groupOption.options) groupOption.options = [];
          groupOption.options.push(sc.data);
        } else {
          options.push(sc.data);
        }
      });

      // Add the master command data and all its options (including sub-commands) to the JSON array
      commandsAsJson.push({
        ...c.data,
        options: c.data.options ? options.concat(c.data.options) : options,
      });
    }
    return commandsAsJson;
  }
}
