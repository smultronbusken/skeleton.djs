import { SlashCommand } from "../../../src/Jobs";

export default new SlashCommand<{}>({
    info: "Lmao",
    name: "regular",
    async execute(interaction, app) { 
        interaction.reply("Looking good bro")
    }
})