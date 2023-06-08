import {
  Collection,
  ApplicationCommandOptionType,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommand,
  APIApplicationCommandOption,
  CommandInteraction,
} from "discord.js";
import { CommandMediator } from "./CommandMediator";
import { CommandToJSON } from "./CommandToJSON";
import { Importable } from "../Importer";
import { SubCommand, MasterCommand } from "../commandTypes/CommandTypes";

export default class SubCommandHandler<T> implements CommandMediator<SubCommand<T>>, CommandToJSON {
  private subCommands: Collection<string, SubCommand<T>> = new Collection();
  private masterCommands: Collection<string, MasterCommand<T>> = new Collection();

  getCommands = () => Array.from(this.subCommands.values());

  getCommand = (id: string) => this.subCommands.get(id);

  setCommand = (id: string, command: SubCommand<T>) => {
    this.subCommands.set(id, command);
  };

  setMasterCommand = (id: string, command: MasterCommand<T>) => {
    this.masterCommands.set(id, command);
  };

  convertCommandsToJSON() {
    const commandsAsJson = [];
    for (const c of this.masterCommands.values()) {
      let options: APIApplicationCommandOption[] = [];
      // Find all direct subcommads
      let subCommands = this.subCommands.filter(sc => sc.master === c.data.name);
      subCommands.forEach(sc => {
        if (sc.group) {
          let groupOption = c.data.options.find(option => {
            return (
              option.type === ApplicationCommandOptionType.SubcommandGroup &&
              option.name == sc.group
            );
          }) as APIApplicationCommandSubcommandGroupOption;

          if (!groupOption) throw new Error(`Subcommand group ${sc.group} does not exist.`);

          if (!groupOption.options) groupOption.options = [];
          groupOption.options.push(sc.data);
        } else {
          options.push(sc.data);
        }
      });

      commandsAsJson.push({
        ...c.data,
        options: c.data.options.concat(options),
      });
    }
    return commandsAsJson;
  }
}

