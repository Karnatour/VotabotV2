const {SlashCommandBuilder} = require('discord.js');
const {queueMap} = require('../../modules/queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skipne song'),
    async execute(interaction) {
        try {
            let queue, player, track
            player = await interaction.client.shoukaku.players.get(interaction.guildId.toString());
            queue = queueMap.get(interaction.guildId.toString());
            track = queue.front();
            await player.seekTo(track.info.length - 1);
            await interaction.reply("Skipped");
        } catch (e) {
            await interaction.reply("Nic nehraje");
        }
    },
};
