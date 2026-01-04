const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const { Player, useMainPlayer } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const { YtDlpExtractor } = require('discord-player-ytdlp');
const express = require('express');
const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded());
app.use(express.json());
const { youtube_token } = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
	  GatewayIntentBits.GuildVoiceStates
  ],
});

const player = new Player(client, {
  skipFFmpeg: false
});
player.extractors.loadMulti(DefaultExtractors); 
player.extractors.register(YtDlpExtractor, {
    ytdlpPath: "./Yt-dlp/yt-dlp.exe", // Path to your yt-dlp binary
    priority: 100,
    enableYouTubeSearch: true,
    enableDirectUrls: true,
    preferYtdlpMetadata: true, // Use yt-dlp for YouTube metadata (default: true)
    streamQuality: 'bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio',
    youtubeiOptions: {
        cookies: `${youtube_token}`,
        client: 'WEB' // Optional: YouTube client
    }
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const playersPath = path.join(__dirname, "players");
const playerFiles = fs
  .readdirSync(playersPath)
  .filter((file) => file.endsWith(".js"));

for (const file of playerFiles) {
  const filePath = path.join(playersPath, file);
  const event = require(filePath);
  player.events.on(event.name, (...args) => event.execute(...args));
}

client.cooldowns = new Collection();
client.msgDelete = new Collection();
client.prefix = new Map();

const prefixPath = path.join(__dirname, "prefix");
const prefixFiles = fs
  .readdirSync(prefixPath)
  .filter((file) => file.endsWith(".js"));
for (const prf of prefixFiles) {
  const filePath = path.join(prefixPath, prf);
  const Cmd = require(filePath);
  client.prefix.set(Cmd.name, Cmd);
}

client.config = require("./config.json");

module.exports = client;

// require("./MusicEvents/index");
client.dataBank = new Object();
app.post('/api/banking-discord', async(req, res) => {
  const sample = "Apikey ";
  const API_TOKEN = req.get("Authorization");
  const TOKEN = API_TOKEN.slice(sample.length, API_TOKEN.length);
  if (!TOKEN === client.config.TOKEN_API)return;
  const data = req.body;
  if(!data) return;
  const command = client.commands.get('sendbill');
  client.dataBank = data;
  await command.execute(client);
  return res.status(200).json({success: true});
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
client.login(token);
