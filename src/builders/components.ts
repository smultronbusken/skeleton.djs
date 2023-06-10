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

/**
 * Creates a Modal interaction response.
 * @param i Data for the modal.
 * @param components Components for the modal.
 */
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

/**
 * Creates a row of components for a modal.
 * @param components Components for the row.
 */
export function modalRow(
  ...components: APIModalActionRowComponent[]
): APIActionRowComponent<APIModalActionRowComponent> {
  let a: APIActionRowComponent<APIModalActionRowComponent> = {
    type: ComponentType.ActionRow,
    components: components,
  };
  return a;
}

/**
 * Creates a row of components for a message.
 * @param components Components for the row.
 */
export function row(
  ...components: APIMessageActionRowComponent[]
): APIActionRowComponent<APIMessageActionRowComponent> {
  let a: APIActionRowComponent<APIMessageActionRowComponent> = {
    type: ComponentType.ActionRow,
    components: components,
  };
  return a;
}

/**
 * Creates a text component.
 * @param i Data for the text component.
 */
export function text(i: Omit<PartialBy<APITextInputComponent, "style">, "type">) {
  let a: APITextInputComponent = {
    type: ComponentType.TextInput,
    style: i.style ? i.style : TextInputStyle.Short,
    ...i,
  };
  return a;
}

/**
 * Creates a button component with custom id.
 * @param i Data for the button component.
 */
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

/**
 * Creates a URL button component.
 * @param i Data for the button component.
 */
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

/**
 * Helper function to create a select menu component.
 * @param i Data for the select menu component.
 */
function select(i: APISelectMenuComponent): APISelectMenuComponent {
  let a: APISelectMenuComponent = {
    ...i,
  };
  return a;
}

/**
 * Creates a channel select component.
 * @param i Data for the channel select component.
 */
export function selectChannel(i: Omit<APIChannelSelectComponent, "type">): APISelectMenuComponent {
  return select({
    type: ComponentType.ChannelSelect,
    ...i,
  });
}

/**
 * Creates a string select component.
 * @param i Data for the string select component.
 * @param option First option for the select menu.
 * @param options Additional options for the select menu.
 */
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

/**
 * Creates a role select component.
 * @param i Data for the role select component.
 */
export function selectRole(i: Omit<APIRoleSelectComponent, "type">): APISelectMenuComponent {
  return select({
    type: ComponentType.RoleSelect,
    ...i,
  });
}

/**
 * Creates a user select component.
 * @param i Data for the user select component.
 */
export function selectUser(i: Omit<APIUserSelectComponent, "type">): APISelectMenuComponent {
  return select({
    type: ComponentType.UserSelect,
    ...i,
  });
}

/**
 * Creates a mentionable select component.
 * @param i Data for the mentionable select component.
 */
export function selectMentionable(
  i: Omit<APIMentionableSelectComponent, "type">,
): APISelectMenuComponent {
  return select({
    type: ComponentType.MentionableSelect,
    ...i,
  });
}
