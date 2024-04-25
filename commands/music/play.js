const {SlashCommandBuilder} = require('discord.js');
const {Queue, queueMap} = require('../../modules/queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Pripoji se k tobe do kanalu a pusti song')
        .addStringOption(option =>
            option.setName("input")
                .setDescription("URL nebo nazev songu")
                .setRequired(true)),
    async execute(interaction) {
        let player,queue;
        try {
            player = await interaction.client.shoukaku.joinVoiceChannel({
                guildId: interaction.guildId,
                channelId: interaction.member.voice.channelId,
                shardId: 0
            });
            queueMap.set(interaction.guildId.toString(), new Queue())
            queue = queueMap.get(interaction.guildId.toString());
        } catch (e) {
            player = await interaction.client.shoukaku.players.get(interaction.guildId.toString());
            queue = queueMap.get(interaction.guildId.toString());
        }

        if (!player.listenerCount('end')) {
            const endListener = async () => {
                if (queue.size() > 0) {
                    queue.removeFromQueue();
                    let track = queue.front();
                    await player.playTrack({track: track.encoded});
                }
            };
            player.on('end', endListener);
        }

        let lavalinkQuery = "ytsearch:" + interaction.options.getString("input");
        const result = await player.node.rest.resolve(lavalinkQuery);
        if (!result?.data.length) {
            interaction.reply("Song nenalezen");
        } else {
            const track = result.data.shift();
            interaction.reply("Pridan song do queue: " + "[" + track.info.title + "](<" + track.info.uri + ">)");
            queue.addToQueue(track);
            if (queue.size() === 1 && player.track == null || player.track === undefined) {
                await player.playTrack({track: track.encoded});
            }
        }
    },
};