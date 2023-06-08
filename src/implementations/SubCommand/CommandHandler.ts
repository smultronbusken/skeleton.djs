import { Collection, APIApplicationCommandOption, ApplicationCommandOptionType, APIApplicationCommandSubcommandGroupOption } from "discord.js";
import { CommandMediator } from "../../command/CommandMediator";
import { APICommandProvider } from "../../deployer/APICommandProvider";
import { MasterCommand } from "./MasterCommand";
import { SubCommand } from "./SubCommand";


export default class SubCommandHandler implements CommandMediator<SubCommand<any>>, APICommandProvider {
  private subCommands: Collection<string, SubCommand<any>> = new Collection();
  private masterCommands: Collection<string, MasterCommand<any>> = new Collection();

  getCommands = () => Array.from(this.subCommands.values());

  getCommand = (id: string) => this.subCommands.get(id);

  setCommand = (id: string, command: SubCommand<any>) => {
    this.subCommands.set(id, command);
  };

  setMasterCommand = (id: string, command: MasterCommand<any>) => {
    this.masterCommands.set(id, command);
  };

  getAPICommands() {
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

