const {SlashCommandBuilder, hyperlink} = require('discord.js');
const {Queue, queueMap} = require('../../modules/queue');
const {EmbedBuilder} = require('discord.js');
const {trackToTime} = require("../utility/TrackToTime");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Zobrazí queue'),
    async execute(interaction) {
        try {
            let queue
            queue = queueMap.get(interaction.guildId.toString());

            const queueEmbed = new EmbedBuilder()
                .setAuthor({name: "Právě hraje:", iconURL: "https://media.tenor.com/IZH_k7F9aqcAAAAi/music.gif"})
                .setTitle(queue.front().info.title)
                .setURL(queue.front().info.uri)
                .setDescription("Dále v pořadí: ")

            if (queue.size !== 1) {
                for (let i = 1; i <= 20; i++) {
                    try {
                        let time = {minutes: 0, seconds: 0, length: queue.items[i].info.length / 1000, embededTime: ""}
                        trackToTime(time);
                        queueEmbed.addFields({name: queue.items[i].info.title, value: time.embededTime + hyperlink(" 🔗", queue.items[i].info.uri)})
                    } catch (e) {
                        break
                    }
                }
            }
            await interaction.reply({embeds: [queueEmbed]});
        } catch (e) {
            await interaction.reply(e.message);
        }
    },
};