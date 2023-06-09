import {
  APIApplicationCommandAttachmentOption,
  APIApplicationCommandBooleanOption,
  APIApplicationCommandChannelOption,
  APIApplicationCommandIntegerOption,
  APIApplicationCommandMentionableOption,
  APIApplicationCommandNumberOption,
  APIApplicationCommandOption,
  APIApplicationCommandOptionBase,
  APIApplicationCommandRoleOption,
  APIApplicationCommandStringOption,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  APIApplicationCommandUserOption,
  ApplicationCommandOptionType,
} from "discord.js";

function attachment(
  i: Omit<APIApplicationCommandAttachmentOption, "type">,
): APIApplicationCommandAttachmentOption {
  return {
    type: ApplicationCommandOptionType.Attachment,
    ...i,
  };
}

function boolean(
  i: Omit<APIApplicationCommandBooleanOption, "type">,
): APIApplicationCommandBooleanOption {
  return {
    type: ApplicationCommandOptionType.Boolean,
    ...i,
  };
}

function channel(
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
function integer(
  i: Omit<APIApplicationCommandIntegerOptionBase, "type">,
): APIApplicationCommandIntegerOptionBase {
  return {
    type: ApplicationCommandOptionType.Integer,
    ...i,
  };
}
function mentionable(
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
function number(
  i: Omit<APIApplicationCommandNumberOptionBase, "type">,
): APIApplicationCommandNumberOptionBase {
  return {
    type: ApplicationCommandOptionType.Number,
    ...i,
  };
}
function role(i: Omit<APIApplicationCommandRoleOption, "type">): APIApplicationCommandRoleOption {
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
function string(
  i: Omit<APIApplicationCommandStringOptionBase, "type">,
): APIApplicationCommandStringOptionBase {
  return {
    type: ApplicationCommandOptionType.String,
    ...i,
  };
}
function sub(
  i: Omit<APIApplicationCommandSubcommandOption, "type">,
): APIApplicationCommandSubcommandOption {
  return {
    type: ApplicationCommandOptionType.Subcommand,
    ...i,
  };
}
function group(
  i: Omit<APIApplicationCommandSubcommandGroupOption, "type">,
): APIApplicationCommandSubcommandGroupOption {
  return {
    type: ApplicationCommandOptionType.SubcommandGroup,
    ...i,
  };
}
function user(i: Omit<APIApplicationCommandUserOption, "type">): APIApplicationCommandUserOption {
  return {
    type: ApplicationCommandOptionType.User,
    ...i,
  };
}

export const options = {
  sub,
  group,
  string,
  integer,
  boolean,
  user,
  channel,
  role,
  mentionable,
  number,
  attachment,
};
export default options;
