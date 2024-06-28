const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('civroll')
        .setDescription('Rollne random civ z aoe4'),
    async execute(interaction) {
        const civMap = new Map();
        civMap.set('Abbasid Dynasty', 'images/aoe4civ/Abbasid.png');
        civMap.set('Chinese','images/aoe4civ/Chinese.webp');
        civMap.set('Delhi Sultanate','images/aoe4civ/Delhi.webp');
        civMap.set('English','images/aoe4civ/English.webp');
        civMap.set('French','images/aoe4civ/French.webp');
        civMap.set('Holy Roman Empire','images/aoe4civ/HRE.webp');
        civMap.set('Malians','images/aoe4civ/Malians.webp');
        civMap.set('Mongols','images/aoe4civ/Mongols.webp');
        civMap.set('Ottomans','images/aoe4civ/Ottomans.webp');
        civMap.set('Rus','images/aoe4civ/Rus.webp');
        civMap.set('Byzanties','images/aoe4civ/Byzanties.webp');
        civMap.set('Japanese','images/aoe4civ/Japanese.webp');
        civMap.set('Ayyubids','images/aoe4civ/Ayyubids.webp');
        civMap.set('Jeanne de Arc','images/aoe4civ/JeanDeArc.webp');
        civMap.set('Order of the Dragon','images/aoe4civ/OOFD.webp');
        civMap.set('Zhu Xi Legacy','images/aoe4civ/ZhuXiLegacy.webp');

        const keys = [...civMap.keys()];
        const civ = keys[~~(Math.random() * keys.length)];
        const civPath = civMap.get(civ);

        const imgFile = new AttachmentBuilder(civPath, { name: 'civ.png' });

        const civEmbed = new EmbedBuilder()
            .setTitle(civ)
            .setImage('attachment://civ.png');

        await interaction.reply({ embeds: [civEmbed], files: [imgFile] });
    },
};