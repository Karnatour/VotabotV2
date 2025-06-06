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
            queue.clearQueue();
            await interaction.reply("Queue cleared");
        } catch (e) {
            await interaction.reply("Fronta je prazdna");
        }
    },
};
