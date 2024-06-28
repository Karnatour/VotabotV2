const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Připojí se k tobě do kanálu'),
    async execute(interaction) {
        const player = await interaction.client.shoukaku.joinVoiceChannel({
            guildId: interaction.guildId,
            channelId: interaction.member.voice.channelId,
            shardId: 0
        });
    },
};