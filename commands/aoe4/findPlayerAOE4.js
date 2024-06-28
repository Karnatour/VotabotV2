// noinspection JSUnresolvedReference

const {SlashCommandBuilder} = require('discord.js');
const {EmbedBuilder} = require('discord.js');
const {AttachmentBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('findplayeraoe4')
        .setDescription('Najde hráče a vypíše jeho staty')
        .addStringOption(option =>
            option.setName("nick")
                .setDescription("Nick hráče")
                .setRequired(true)),
    async execute(interaction) {
        try {
            const response = await fetch('https://aoe4world.com/api/v0/players/search?query=' + interaction.options.getString("nick"));
            if (!response.ok) {
                throw new Error()
            }
            const data = await response.json();
            const player = data.players[0];
            let siteProfile
            try {
                siteProfile = await fetch('https://aoe4world.com/api/v0/players/' + player.profile_id)
                siteProfile = await siteProfile.json()
            } catch (err) {
                await interaction.reply({content: "User not found"});
            }
            const imgFile = new AttachmentBuilder("images/flags/" + player.country + ".png", {name: 'flag.png'});
            const fields = [];

            if (player.leaderboards.rm_solo) {
                fields.push({
                    name: "Solo Rank: " + (player.leaderboards.rm_solo.rank_level ? player.leaderboards.rm_solo.rank_level : "Unranked") + "    🏆 " + player.leaderboards.rm_solo.rating + "    📈 " + player.leaderboards.rm_solo.rank,
                    value: "Win Rate: " + player.leaderboards.rm_solo.win_rate + "%    ✅ " + player.leaderboards.rm_solo.wins_count + " ❌ " + player.leaderboards.rm_solo.losses_count
                });
            }

            if (player.leaderboards.rm_team) {
                fields.push({
                    name: "Team Rank: " + (player.leaderboards.rm_team.rank_level ? player.leaderboards.rm_team.rank_level : "Unranked") + "    🏆 " + player.leaderboards.rm_team.rating + "    📈 " + player.leaderboards.rm_team.rank,
                    value: "Win Rate: " + player.leaderboards.rm_team.win_rate + "%    ✅ " + player.leaderboards.rm_team.wins_count + " ❌ " + player.leaderboards.rm_team.losses_count
                });
            }


            const playerEmbed = new EmbedBuilder()
                .setTitle(player.name)
                .setURL(siteProfile.site_url)
                .setThumbnail('attachment://flag.png')
                //.setAuthor({name: player.displayName})
                .addFields(...fields);

            await interaction.reply({embeds: [playerEmbed], files: [imgFile]});
        } catch (error) {
            await interaction.reply({content: error.message});
        }
    },
};
