const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Odpovi pong!'),
    async execute(interaction) {
        await interaction.reply('Pong!')
    },
};