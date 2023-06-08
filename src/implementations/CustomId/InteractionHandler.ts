import { BaseInteraction, Interaction } from "discord.js";
import { CommandMediator } from "../../command/CommandMediator";
import { CustomIdCommand } from "./Command";
import { InteractionHandler } from "../../eventhandlers/InteractionHandler";

export default class CustomIdCommandInteractionHandler extends InteractionHandler<CustomIdInteraction> {
  constructor(public mediator: CommandMediator<CustomIdCommand<any>>) {
    super();
  }

  typeGuard = (interaction: BaseInteraction): interaction is CustomIdInteraction =>
    isCustomInteraction(interaction);

  // Do not handle subcommands
  check = (interaction: CustomIdInteraction) => {
    return this.mediator.getCommands().find(cid => cid.customId === interaction.customId);
  };

  execute = async (interaction: CustomIdInteraction, context: any) => {
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
