import { BaseInteraction, Collection, CommandInteraction } from "discord.js";

import { Job, JobRegister } from "../Jobs";
import { InteractionHandler } from "../interactions/InteractionHandler";

export default class CustomIdInteractionHandler<T> {
  private customIdsCommands: Collection<
    string,
    (interaction: CustomIdInteraction, context: any) => any
  > = new Collection();

  isCustomInteraction(obj: unknown): obj is CustomIdInteraction {
    return (
      obj instanceof BaseInteraction &&
      obj !== null &&
      "customId" in obj &&
      typeof (obj as any).customId === "string"
    );
  }

  handler: InteractionHandler<CustomIdInteraction> = {
    typeGuard: (interaction): interaction is CustomIdInteraction =>
      this.isCustomInteraction(interaction),
    check: interaction =>
      this.customIdsCommands.findKey(cid => (v, cid, c) => cid === interaction.customId),
    execute: async (interaction, context) => {
      this.customIdsCommands.get(interaction.customId)(interaction, context);
    },
  };

  CustomIdOnRegister = {
    type: CustomIdCommand,
    func: (job: CustomIdCommand<T>) => {
      this.customIdsCommands.set(job.customId, job.execute);
    },
  };
}

export type CustomIdInteraction = BaseInteraction & { customId: string };

@JobRegister.JobClass
export class CustomIdCommand<T> extends Job<T> {
  customId: string;
  constructor(customId: string, execute: (i: CustomIdInteraction, context: T) => any) {
    super(execute);
    this.customId = customId;
  }
}
