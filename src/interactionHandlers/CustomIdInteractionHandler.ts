import { BaseInteraction, ChatInputCommandInteraction, Interaction } from "discord.js";
import { CommandMediator } from "../command/CommandMediator";
import { InteractionHandler } from "./InteractionHandler";
import { CustomIdCommand } from "../command/CustomIdCommandHandler";

export default class CustomIdCommandInteractionHandler<T> extends InteractionHandler<
  CustomIdInteraction,
  T
> {
  constructor(public mediator: CommandMediator<CustomIdCommand<T>>) {
    super();
  }

  typeGuard = (interaction: BaseInteraction): interaction is CustomIdInteraction =>
    isCustomInteraction(interaction);

  // Do not handle subcommands
  check = (interaction: CustomIdInteraction) => {
    return this.mediator.getCommands().find(cid => cid.customId === interaction.customId);
  };

  execute = async (interaction: CustomIdInteraction, context: T) => {
    const command = this.mediator.getCommand(interaction.customId);
    await command?.execute(interaction, context);
  };
}

export type CustomIdInteraction = Interaction & { customId: string };

export function isCustomInteraction(obj: unknown): obj is CustomIdInteraction {
  return (
    obj instanceof BaseInteraction &&
    obj !== null &&
    "customId" in obj &&
    typeof (obj as any).customId === "string"
  );
}
