import {
  APIApplicationCommand,
  ApplicationCommandOptionBase,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Collection,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";

import { InteractionHandler } from "../interactions/InteractionHandler";
import { JobRegister } from "../Jobs";
import { CommandBase, CommandInput } from "./Command";
import { SlashCommand } from "./SlashCommand";

export class ContextMenuHandler<T> {
  private commands: Collection<string, CommandBase<T>> = new Collection();

  handler: InteractionHandler<ContextMenuCommandInteraction> = {
    typeGuard: (interaction): interaction is ContextMenuCommandInteraction =>
      interaction.isContextMenuCommand(),
    check: interaction => true,
    execute: async (interaction, context) => {
      const command = this.commands.get(interaction.commandName);
      if (!command) {
        throw new Error(
          `The command type was found but the command ${interaction.commandName} not found`,
        );
      }
      await command.execute(interaction, context);
    },
  };

  userContextMenuRegister = {
    type: UserCommand,
    func: (job: UserCommand<T>) => {
      this.commands.set(job.data.name, job);
    },
  };

  messageContextMenuRegister = {
    type: MessageCommand,
    func: (job: MessageCommand<T>) => {
      this.commands.set(job.data.name, job);
    },
  };

  convertCommandsToJSON = () => {
    const commandsAsJson = [];
    this.commands.forEach(c => {
      commandsAsJson.push({
        ...c.data,
        //options: c.commandStructure.options.map(option => option.toJSON()),
      });
    });
    return commandsAsJson;
  };
}

@JobRegister.JobClass
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

@JobRegister.JobClass
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
