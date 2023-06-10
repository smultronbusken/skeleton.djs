import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
  CommandInteraction,
  Interaction,
} from "discord.js";
import { SlashCommand } from "../../../implementations/SlashCommand/Command";

import { Modal, text } from "../../../builders/components";
import { string, integer } from "../../../builders/options";
import { SubCommand } from "../../../main";

export default new SubCommand(
  {
    master: "mastercommand",
    name: "subcommand",
    description: "A subcommand example.",
  },
  (interaction: CommandInteraction, app, skeleton) => {
    let modalID = "custommodal";

    let m = Modal(
      {
        custom_id: modalID,
        title: "This is a modal!",
      },
      text({
        custom_id: "foo",
        label: "Foo?",
      }),
      text({
        custom_id: "bar",
        label: "Bar?",
        required: true,
      }),
    );

    skeleton.handleModalSubmit(modalID, interaction => {
      // Handle submission
      interaction.reply("Thank you for your submission!");
    });

    interaction.showModal(m);
  },
  string({
    name: "s",
    description: "A string option",
    max_length: 10,
    choices: [{ name: "hej", value: "LOL" }],
  }),
);
