import {
  AnySelectMenuInteraction,
  CacheType,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  MessageComponentInteraction,
  RoleSelectMenuInteraction,
  SnowflakeUtil,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
} from "discord.js";
import { Mediator } from "../../command/Mediator";
import ImportHandler from "../../importer/ImportHandler";
import {
  ButtonCommand,
  ChannelSelectCommand,
  ComponentCommand,
  MentionableSelectCommand,
  RoleSelectCommand,
  SelectBoxCommand,
  StringSelectCommand,
  UserSelectCommand,
} from "./Command";

export interface Class<T> {
  new (...args: any[]): T;
}

export class ComponentCommandImportHandler<T extends ComponentCommand> implements ImportHandler<T> {
  classToBeImported: Class<T>;
  constructor(public mediator: Mediator<T>) {}
  onImport = (command: T) => {
    this.mediator.set(SnowflakeUtil.generate().toString(), command);
  };
}

export class ButtonCommandImportHandler extends ComponentCommandImportHandler<ButtonCommand> {
  classToBeImported = ButtonCommand;
}

export class SelectCommandImportHandler<
  I extends AnySelectMenuInteraction,
  T extends SelectBoxCommand<I>,
> extends ComponentCommandImportHandler<T> {}

export class StringSelectCommandImportHandler extends SelectCommandImportHandler<
  StringSelectMenuInteraction,
  StringSelectCommand
> {
  classToBeImported = StringSelectCommand;
}
export class RoleSelectCommandImportHandler extends SelectCommandImportHandler<
  RoleSelectMenuInteraction,
  RoleSelectCommand
> {
  classToBeImported = RoleSelectCommand;
}
export class UserSelectCommandImportHandler extends SelectCommandImportHandler<
  UserSelectMenuInteraction,
  UserSelectCommand
> {
  classToBeImported = UserSelectCommand;
}
export class MentionableSelectCommandImportHandler extends SelectCommandImportHandler<
  MentionableSelectMenuInteraction,
  MentionableSelectCommand
> {
  classToBeImported = MentionableSelectCommand;
}
export class ChannelSelectCommandImportHandler extends SelectCommandImportHandler<
  ChannelSelectMenuInteraction,
  ChannelSelectCommand
> {
  classToBeImported = ChannelSelectCommand;
}
