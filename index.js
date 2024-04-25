const path = require('path');
const fs = require('fs');
const {token} = require('./config.json');
const {Client, Events, Collection, GatewayIntentBits} = require('discord.js');
const {Shoukaku, Connectors} = require("shoukaku");
const Nodes = [
    {
        name: "votabot",
        url: "127.0.0.1:2333",
        auth: "youshallnotpass",
    },
];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
    ],
});

const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), Nodes);

shoukaku.on("error", (_, error) => console.error(error));

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();
client.shoukaku = shoukaku;

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
    }
});

client.login(token).catch(error => {
    console.error("Error logging in:", error);
});

module.exports = client;