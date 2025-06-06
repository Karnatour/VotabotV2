const {SlashCommandBuilder} = require('discord.js');
const {queueMap} = require('../../modules/queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Smaze z queue vsechny songy'),
    async execute(interaction) {
        try {
            let queue
            queue = queueMap.get(interaction.guildId.toString());
            if (!queue || queue.size() <= 1) {
                return await interaction.reply("Queue obsahuje jen jednu skladbu nebo je prázdná.");
            }
            queue.clearQueue();
            await interaction.reply("Queue vymazána");
        } catch (e) {
            await interaction.reply("Error při mazání queue");
        }
    },
};
