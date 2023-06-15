import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  MessageComponentInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
} from "discord.js";
import { Skeleton } from "../../Skeleton";
import { Executable, InteractionExecutableContainer } from "../../command/BaseCommand";
import { Importable } from "../../importer/Importer";

interface ComponentCommandInput {
  customId?: string;
  regex?: RegExp;
}

export class ComponentCommand extends InteractionExecutableContainer {
  customId: string;
  regex: RegExp;
  constructor(input: ComponentCommandInput, execute: Executable<MessageComponentInteraction>) {
    super(execute);
    if (!input.customId && !input.regex) throw new Error("You must specify CustomId or RegExp.");
    this.customId = input.customId;
    this.regex = input.regex;
  }
}

@Importable
export class ButtonCommand extends ComponentCommand {
  constructor(customId: ComponentCommandInput, execute: Executable<ButtonInteraction>) {
    super(customId, execute);
  }
}

export class SelectBoxCommand<T extends AnySelectMenuInteraction> extends ComponentCommand {
  constructor(customId: ComponentCommandInput, execute: Executable<T>) {
    super(customId, execute);
  }
}

@Importable
export class StringSelectCommand extends SelectBoxCommand<StringSelectMenuInteraction> {}
@Importable
export class RoleSelectCommand extends SelectBoxCommand<RoleSelectMenuInteraction> {}
@Importable
export class UserSelectCommand extends SelectBoxCommand<UserSelectMenuInteraction> {}
@Importable
export class MentionableSelectCommand extends SelectBoxCommand<MentionableSelectMenuInteraction> {}
@Importable
export class ChannelSelectCommand extends SelectBoxCommand<ChannelSelectMenuInteraction> {}
