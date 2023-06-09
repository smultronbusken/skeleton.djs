import {
  APIApplicationCommandAttachmentOption,
  APIApplicationCommandBooleanOption,
  APIApplicationCommandChannelOption,
  APIApplicationCommandIntegerOption,
  APIApplicationCommandMentionableOption,
  APIApplicationCommandNumberOption,
  APIApplicationCommandOption,
  APIApplicationCommandOptionBase,
  APIApplicationCommandOptionChoice,
  APIApplicationCommandOptionWithAutocompleteOrChoicesWrapper,
  APIApplicationCommandRoleOption,
  APIApplicationCommandStringOption,
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
  i: Omit<APIApplicationCommandStringOption, "type">,
): APIApplicationCommandNumberOption {
  // @ts-ignore TODO explain why needed / fix it
  return {
    type: ApplicationCommandOptionType.Number,
    ...i,
  };
}

export function string(
  i: Omit<APIApplicationCommandStringOption, "type">,
): APIApplicationCommandStringOption {
  // @ts-ignore TODO explain why needed / fix it
  return {
    type: ApplicationCommandOptionType.String,
    ...i,
  };
}
export function integer(
  i: Omit<APIApplicationCommandStringOption, "type">,
): APIApplicationCommandIntegerOption {
  // @ts-ignore TODO explain why needed / fix it
  return {
    type: ApplicationCommandOptionType.Integer,
    ...i,
  };
}

export function role(
  i: Omit<APIApplicationCommandRoleOption, "type">,
): APIApplicationCommandRoleOption {
  return {
    type: ApplicationCommandOptionType.Role,
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
export function user(
  i: Omit<APIApplicationCommandUserOption, "type">,
): APIApplicationCommandUserOption {
  return {
    type: ApplicationCommandOptionType.User,
    ...i,
  };
}
