import {
  APIApplicationCommand,
  APIApplicationCommandSubcommandOption,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  CommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { Importable } from "../importer/Importer";
import { Skeleton } from "../main";
import { CollectionMediator } from "./Mediator";
import APICommandProvider from "../deployer/APICommandProvider";

/**
 * Defines a class which  has a  executable in an interaction.
 */
export class InteractionExecutableContainer<T> {
  constructor(public execute: (interaction: any, context: T, skeleton?: Skeleton<T>) => any) {}
}

/**
 * Type that is used for all command execution methods.
 */
export type InteractionExecutable<T> = (
  interaction: CommandInteraction,
  context: T,
  skeleton: Skeleton<T>,
) => void;

type ApplicationCommandNonInput = Omit<
  APIApplicationCommand,
  "id" | "version" | "type" | "application_id" | "default_member_permissions"
>;

type ApplicationCommandNonInputOptional = {
  id?: string;
  version?: string;
  default_member_permissions?: string;
};

/**
 * Combined type with both mandatory and optional fields for a command.
 */
export type CommandInput = ApplicationCommandNonInput & ApplicationCommandNonInputOptional;

/**
 * Abstract base class for a command.
 */
export abstract class CommandBase<T> extends InteractionExecutableContainer<T> {
  /**
   * Creates a new command.
   * @param data - APIApplicationCommand data for the command. see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object}
   * @param execute - Function to execute when the subcommand is called.
   */
  constructor(
    public data: APIApplicationCommand,
    public execute: (interaction: any, context: T, skeleton?: Skeleton<T>) => any,
  ) {
    super(execute);
  }
}

export class CommandMediator<T extends CommandBase<any>>
  extends CollectionMediator<T>
  implements APICommandProvider
{
  getAPICommands = () => {
    const commandsAsJson: APIApplicationCommand[] = [];
    this.elements.forEach(c => {
      commandsAsJson.push({
        ...c.data,
      });
    });
    return commandsAsJson;
  };
}
