const {SlashCommandBuilder} = require('discord.js');
const {queueMap} = require('../../modules/queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Odpojí se z kanálu a smaže queue'),
    async execute(interaction) {
         await interaction.client.shoukaku.leaveVoiceChannel({
             guildId: interaction.guildId.toString()
         });
        queueMap.delete(interaction.guildId.toString());
    },
};