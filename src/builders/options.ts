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

/**
 * Creates an attachment option for an application command.
 * @param i The data for the attachment option.
 */
export function attachment(
  i: Omit<APIApplicationCommandAttachmentOption, "type">,
): APIApplicationCommandAttachmentOption {
  return {
    type: ApplicationCommandOptionType.Attachment,
    ...i,
  };
}

/**
 * Creates a boolean option for an application command.
 * @param i The data for the boolean option.
 */
export function boolean(
  i: Omit<APIApplicationCommandBooleanOption, "type">,
): APIApplicationCommandBooleanOption {
  return {
    type: ApplicationCommandOptionType.Boolean,
    ...i,
  };
}

/**
 * Creates a channel option for an application command.
 * @param i The data for the channel option.
 */
export function channel(
  i: Omit<APIApplicationCommandChannelOption, "type">,
): APIApplicationCommandChannelOption {
  return {
    type: ApplicationCommandOptionType.Channel,
    ...i,
  };
}

/**
 * Creates a mentionable option for an application command.
 * @param i The data for the mentionable option.
 */
export function mentionable(
  i: Omit<APIApplicationCommandMentionableOption, "type">,
): APIApplicationCommandMentionableOption {
  return {
    type: ApplicationCommandOptionType.Mentionable,
    ...i,
  };
}

/**
 * Creates a number option for an application command.
 * @param i The data for the number option.
 */
export function number(
  i: Omit<APIApplicationCommandStringOption, "type">,
): APIApplicationCommandNumberOption {
  // @ts-ignore TODO explain why needed / fix it
  return {
    type: ApplicationCommandOptionType.Number,
    ...i,
  };
}

/**
 * Creates a string option for an application command.
 * @param i The data for the string option.
 */
export function string(
  i: Omit<APIApplicationCommandStringOption, "type">,
): APIApplicationCommandStringOption {
  // @ts-ignore TODO explain why needed / fix it
  return {
    type: ApplicationCommandOptionType.String,
    ...i,
  };
}

/**
 * Creates an integer option for an application command.
 * @param i The data for the integer option.
 */
export function integer(
  i: Omit<APIApplicationCommandStringOption, "type">,
): APIApplicationCommandIntegerOption {
  // @ts-ignore TODO explain why needed / fix it
  return {
    type: ApplicationCommandOptionType.Integer,
    ...i,
  };
}

/**
 * Creates a role option for an application command.
 * @param i The data for the role option.
 */
export function role(
  i: Omit<APIApplicationCommandRoleOption, "type">,
): APIApplicationCommandRoleOption {
  return {
    type: ApplicationCommandOptionType.Role,
    ...i,
  };
}

/**
 * Creates a subcommand option for an application command.
 * @param i The data for the subcommand option.
 */
export function sub(
  i: Omit<APIApplicationCommandSubcommandOption, "type">,
): APIApplicationCommandSubcommandOption {
  return {
    type: ApplicationCommandOptionType.Subcommand,
    ...i,
  };
}

/**
 * Creates a subcommand group option for an application command.
 * @param i The data for the subcommand group option.
 */
export function group(
  i: Omit<APIApplicationCommandSubcommandGroupOption, "type">,
): APIApplicationCommandSubcommandGroupOption {
  return {
    type: ApplicationCommandOptionType.SubcommandGroup,
    ...i,
  };
}

/**
 * Creates a user option for an application command.
 * @param i The data for the user option.
 */
export function user(
  i: Omit<APIApplicationCommandUserOption, "type">,
): APIApplicationCommandUserOption {
  return {
    type: ApplicationCommandOptionType.User,
    ...i,
  };
}
