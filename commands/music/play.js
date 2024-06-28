const {SlashCommandBuilder} = require('discord.js');
const {Queue, queueMap} = require('../../modules/queue');
const {EmbedBuilder} = require('discord.js');
const {trackToTime} = require('../utility/TrackToTime');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Připojí se k tobě do kanálu a pustí song')
        .addStringOption(option =>
            option.setName("input")
                .setDescription("URL nebo nazev songu")
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName("playlist")
                .setDescription("Pokud je playlist")
                .setRequired(false)),
    async execute(interaction) {
        let player, queue;
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
            player.on('end', async () => {
                if (queue.size() > 0) {
                    queue.removeFromQueue();
                    let track = queue.front();
                    await player.playTrack({track: track.encoded});
                }
            });
        }
        let lavalinkQuery, trackEmbed
        if (interaction.options.getBoolean("playlist")) {
            lavalinkQuery = interaction.options.getString("input");
            const result = await player.node.rest.resolve(lavalinkQuery);
            if (!result.data) {
                await interaction.reply("Playlist nenalezen");
            } else {
                let tracksToAdd = result.data.tracks.slice(0);
                tracksToAdd.forEach(track => queue.addToQueue(track));
                if (!player.track) {
                    await player.playTrack({track: queue.front().encoded});
                }
                trackEmbed = new EmbedBuilder()
                    .setTitle(result.data.info.name)
                    .setURL(interaction.options.getString("input"))
                    .setAuthor({name: "Playlist přídán do queue"})
                    .setDescription("Počet songů v playlistu: " + result.data.tracks.length.toString())
                    .setTimestamp()
                    .setFooter({text: interaction.member.user.username, iconURL: interaction.user.displayAvatarURL()})
            }

        } else {
            lavalinkQuery = "ytsearch:" + interaction.options.getString("input");
            const result = await player.node.rest.resolve(lavalinkQuery);
            if (!result.data.length) {
                interaction.reply("Song nenalezen");
            } else {
                const track = result.data.shift();
                queue.addToQueue(track);
                if (queue.size() === 1 && !player.track) {
                    await player.playTrack({track: track.encoded});
                }

                let time = {minutes: 0, seconds: 0, length: track.info.length / 1000, embededTime: ""}
                trackToTime(time);

                trackEmbed = new EmbedBuilder()
                    .setTitle(track.info.title)
                    .setURL(track.info.uri)
                    .setAuthor({name: "Nový song přidán do queue"})
                    .setImage(track.info.artworkUrl)
                    .setDescription(track.info.author)
                    .addFields(
                        {name: "Délka songu", value: time.embededTime}
                    )
                    .setTimestamp()
                    .setFooter({text: interaction.member.user.username, iconURL: interaction.user.displayAvatarURL()})
            }
        }
        await interaction.reply({embeds: [trackEmbed]});
    },
};