import {
  APIModalInteractionResponseCallbackData,
  APIActionRowComponentTypes,
  APIActionRowComponent,
  ComponentType,
  APITextInputComponent,
  TextInputStyle,
  APIButtonComponentWithCustomId,
  ButtonStyle,
  APIButtonComponentWithURL,
  APIApplicationCommandBasicOption,
  APIMessageActionRowComponent,
  APIModalActionRowComponent,
  APIModalComponent,
  APIMessageComponent,
  APIButtonComponent,
  StringSelectMenuBuilder,
  APIStringSelectComponent,
  APIBaseSelectMenuComponent,
  APIBaseComponent,
  APISelectMenuComponent,
  APIChannelSelectComponent,
  APIMentionableSelectComponent,
  APIRoleSelectComponent,
  APIUserSelectComponent,
  APISelectMenuOption,
} from "discord.js";
import { PartialBy } from "../util/types";

export function Modal(
  i: Omit<APIModalInteractionResponseCallbackData, "components">,
  ...components: APIModalActionRowComponent[]
): APIModalInteractionResponseCallbackData {
  let rows = [];
  for (let i = 0; i < components.length; i++) {
    rows.push(modalRow(components[i]));
  }
  return {
    ...i,
    components: rows,
  };
}

export function modalRow(
  ...components: APIModalActionRowComponent[]
): APIActionRowComponent<APIModalActionRowComponent> {
  let a: APIActionRowComponent<APIModalActionRowComponent> = {
    type: ComponentType.ActionRow,
    components: components,
  };
  return a;
}

export function row(
  ...components: APIMessageActionRowComponent[]
): APIActionRowComponent<APIMessageActionRowComponent> {
  let a: APIActionRowComponent<APIMessageActionRowComponent> = {
    type: ComponentType.ActionRow,
    components: components,
  };
  return a;
}

export function text(i: Omit<PartialBy<APITextInputComponent, "style">, "type">) {
  let a: APITextInputComponent = {
    type: ComponentType.TextInput,
    style: i.style ? i.style : TextInputStyle.Short,
    ...i,
  };
  return a;
}

export function button(
  i: Omit<PartialBy<APIButtonComponentWithCustomId, "style">, "type">,
): APIMessageActionRowComponent {
  let a: APIButtonComponentWithCustomId = {
    type: ComponentType.Button,
    style: i.style ? i.style : ButtonStyle.Primary,
    ...i,
  };
  return a;
}

export function urlButton(
  i: Omit<PartialBy<APIButtonComponentWithURL, "style">, "type">,
): APIMessageActionRowComponent {
  let a: APIButtonComponentWithURL = {
    type: ComponentType.Button,
    style: ButtonStyle.Link,
    ...i,
  };
  return a;
}

function select(i: APISelectMenuComponent): APISelectMenuComponent {
  let a: APISelectMenuComponent = {
    ...i,
  };
  return a;
}

export function selectChannel(i: Omit<APIChannelSelectComponent, "type">): APISelectMenuComponent {
  return select({
    type: ComponentType.ChannelSelect,
    ...i,
  });
}

export function selectString(
  i: Omit<APIStringSelectComponent, "type" | "options">,
  option: APISelectMenuOption,
  ...options: APISelectMenuOption[]
): APISelectMenuComponent {
  if (options) options.push(option);
  else options = [option];
  return select({
    type: ComponentType.StringSelect,
    options: options,
    ...i,
  });
}

export function selectRole(i: Omit<APIRoleSelectComponent, "type">): APISelectMenuComponent {
  return select({
    type: ComponentType.RoleSelect,
    ...i,
  });
}

export function selectUser(i: Omit<APIUserSelectComponent, "type">): APISelectMenuComponent {
  return select({
    type: ComponentType.UserSelect,
    ...i,
  });
}

export function selectMentionable(
  i: Omit<APIMentionableSelectComponent, "type">,
): APISelectMenuComponent {
  return select({
    type: ComponentType.MentionableSelect,
    ...i,
  });
}
