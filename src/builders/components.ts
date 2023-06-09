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
} from "discord.js";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

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
