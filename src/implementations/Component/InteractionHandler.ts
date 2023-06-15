import {
  AnySelectMenuInteraction,
  BaseInteraction,
  ButtonInteraction,
  CacheType,
  ChannelSelectMenuInteraction,
  Interaction,
  MentionableSelectMenuInteraction,
  MessageComponentInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
} from "discord.js";
import { Mediator } from "../../command/Mediator";
import { InteractionHandler } from "../../eventhandlers/InteractionHandler";
import { Skeleton } from "../../Skeleton";
import { ButtonCommand, ComponentCommand, RoleSelectCommand, SelectBoxCommand } from "./Command";

abstract class ComponentInteractionHandler<
  T extends MessageComponentInteraction,
  C extends ComponentCommand,
> extends InteractionHandler<T> {
  constructor(public mediator: Mediator<C>) {
    super();
  }

  check = (interaction: T) => {
    return !!this.getCommand(interaction.customId);
  };

  execute = async (interaction: T, context: any, skeleton: Skeleton) => {
    const command = this.getCommand(interaction.customId);
    await command?.execute(interaction, context, skeleton);
  };

  getCommand(interactionCustomId: string): C | undefined {
    let commands = this.mediator.getAll();
    let commandFound = commands.find(c => {
      c?.regex.test(interactionCustomId) || c?.customId === interactionCustomId;
    });
    return commandFound;
  }
}

export class ButtonCommandInteractionHandler extends ComponentInteractionHandler<
  ButtonInteraction,
  ButtonCommand
> {
  typeGuard = (interaction: BaseInteraction): interaction is ButtonInteraction =>
    interaction.isButton();
}

export abstract class SelectCommandInteractionHandler<
  T extends AnySelectMenuInteraction,
> extends ComponentInteractionHandler<T, SelectBoxCommand<T>> {}

export class RoleSelectInteractionHandler extends ComponentInteractionHandler<
  RoleSelectMenuInteraction,
  RoleSelectCommand
> {
  typeGuard = (interaction: BaseInteraction): interaction is RoleSelectMenuInteraction =>
    interaction.isRoleSelectMenu();
}

export class StringSelectInteractionHandler extends SelectCommandInteractionHandler<StringSelectMenuInteraction> {
  typeGuard = (interaction: BaseInteraction): interaction is StringSelectMenuInteraction =>
    interaction.isStringSelectMenu();
}

export class UserSelectInteractionHandler extends SelectCommandInteractionHandler<UserSelectMenuInteraction> {
  typeGuard = (interaction: BaseInteraction): interaction is UserSelectMenuInteraction =>
    interaction.isUserSelectMenu();
}

export class MentionableSelectInteractionHandler extends SelectCommandInteractionHandler<MentionableSelectMenuInteraction> {
  typeGuard = (interaction: BaseInteraction): interaction is MentionableSelectMenuInteraction =>
    interaction.isMentionableSelectMenu();
}

export class ChannelSelectInteractionHandler extends SelectCommandInteractionHandler<ChannelSelectMenuInteraction> {
  typeGuard = (interaction: BaseInteraction): interaction is ChannelSelectMenuInteraction =>
    interaction.isChannelSelectMenu();
}
