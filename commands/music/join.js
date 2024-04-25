const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Pripoji se k tobe do kanalu'),
    async execute(interaction) {
        const player = await interaction.client.shoukaku.joinVoiceChannel({
            guildId: interaction.guildId,
            channelId: interaction.member.voice.channelId,
            shardId: 0
        });
    },
};