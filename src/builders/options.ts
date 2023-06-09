import {
  APIApplicationCommandAttachmentOption,
  APIApplicationCommandBooleanOption,
  APIApplicationCommandChannelOption,
  APIApplicationCommandMentionableOption,
  APIApplicationCommandOption,
  APIApplicationCommandOptionBase,
  APIApplicationCommandRoleOption,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  APIApplicationCommandUserOption,
  ApplicationCommandOptionType,
} from "discord.js";

export function attachment(
  i: Omit<APIApplicationCommandAttachmentOption, "type">,
): APIApplicationCommandAttachmentOption {
  return {
    type: ApplicationCommandOptionType.Attachment,
    ...i,
  };
}

export function boolean(
  i: Omit<APIApplicationCommandBooleanOption, "type">,
): APIApplicationCommandBooleanOption {
  return {
    type: ApplicationCommandOptionType.Boolean,
    ...i,
  };
}

export function channel(
  i: Omit<APIApplicationCommandChannelOption, "type">,
): APIApplicationCommandChannelOption {
  return {
    type: ApplicationCommandOptionType.Channel,
    ...i,
  };
}

interface APIApplicationCommandIntegerOptionBase
  extends APIApplicationCommandOptionBase<ApplicationCommandOptionType.Integer> {
  min_value?: number;
  max_value?: number;
}
export function integer(
  i: Omit<APIApplicationCommandIntegerOptionBase, "type">,
): APIApplicationCommandIntegerOptionBase {
  return {
    type: ApplicationCommandOptionType.Integer,
    ...i,
  };
}
export function mentionable(
  i: Omit<APIApplicationCommandMentionableOption, "type">,
): APIApplicationCommandMentionableOption {
  return {
    type: ApplicationCommandOptionType.Mentionable,
    ...i,
  };
}

interface APIApplicationCommandNumberOptionBase
  extends APIApplicationCommandOptionBase<ApplicationCommandOptionType.Number> {
  min_value?: number;
  max_value?: number;
}
export function number(
  i: Omit<APIApplicationCommandNumberOptionBase, "type">,
): APIApplicationCommandNumberOptionBase {
  return {
    type: ApplicationCommandOptionType.Number,
    ...i,
  };
}
export function role(i: Omit<APIApplicationCommandRoleOption, "type">): APIApplicationCommandRoleOption {
  return {
    type: ApplicationCommandOptionType.Role,
    ...i,
  };
}

interface APIApplicationCommandStringOptionBase
  extends APIApplicationCommandOptionBase<ApplicationCommandOptionType.String> {
  min_length?: number;
  max_length?: number;
}
export function string(
  i: Omit<APIApplicationCommandStringOptionBase, "type">,
): APIApplicationCommandStringOptionBase {
  return {
    type: ApplicationCommandOptionType.String,
    ...i,
  };
}
export function sub(
  i: Omit<APIApplicationCommandSubcommandOption, "type">,
): APIApplicationCommandSubcommandOption {
  return {
    type: ApplicationCommandOptionType.Subcommand,
    ...i,
  };
}
export function group(
  i: Omit<APIApplicationCommandSubcommandGroupOption, "type">,
): APIApplicationCommandSubcommandGroupOption {
  return {
    type: ApplicationCommandOptionType.SubcommandGroup,
    ...i,
  };
}
export function user(i: Omit<APIApplicationCommandUserOption, "type">): APIApplicationCommandUserOption {
  return {
    type: ApplicationCommandOptionType.User,
    ...i,
  };
}

export function Options(...o: APIApplicationCommandOption[]) : APIApplicationCommandOption[] {
  return o
}