const {
  Client,
  Events,
  GatewayIntentBits,
  ActivityType,
} = require("discord.js");
const config = require("../config.json");
const CommandHandler = require("./commands/handler");

const SCping = require("./commands/slash/ping");
const SCemoji = require("./commands/slash/emoji");
const SCsticker = require("./commands/slash/sticker");
const SCpack = require("./commands/slash/pack");
const SCcustompack = require("./commands/slash/customPack");
const SCwebsite = require("./commands/slash/website");
const SCdiscord = require("./commands/slash/discord");
const { default: axios } = require("axios");

CommandHandler();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  
  setInterval(async () => {
    const wh = Math.floor(Math.random() * 7);

    if (wh == 0) {
      let tData = "";
      await axios.get(" https://imocord.ir/api/count/users").then((e) => {
        tData = e.data;
      });
      client.user.setActivity(`${tData} users`, {
        type: ActivityType.Watching,
      });
    } else if (wh == 1) {
      let tData = "";
      await axios.get(" https://imocord.ir/api/count/emoji").then((e) => {
        tData = e.data;
      });
      client.user.setActivity(`${tData} emojis`, {
        type: ActivityType.Watching,
      });
    } else if (wh == 2) {
      let tData = "";
      await axios.get(" https://imocord.ir/api/count/sticker").then((e) => {
        tData = e.data;
      });
      client.user.setActivity(`${tData} stickers`, {
        type: ActivityType.Watching,
      });
    } else if (wh == 3) {
      let tData = "";
      await axios.get(" https://imocord.ir/api/count/pack").then((e) => {
        tData = e.data;
      });
      client.user.setActivity(`${tData} packs`, {
        type: ActivityType.Watching,
      });
    } else if (wh == 4) {
      let tData = "";
      await axios.get(" https://imocord.ir/api/count/profile").then((e) => {
        tData = e.data;
      });
      client.user.setActivity(`${tData} profiles`, {
        type: ActivityType.Watching,
      });
    } else if (wh == 5) {
      let tData = "";
      await axios.get(" https://imocord.ir/api/count/banner").then((e) => {
        tData = e.data;
      });
      client.user.setActivity(`${tData} banners`, {
        type: ActivityType.Watching,
      });
    } else if (wh == 6) {
      client.user.setActivity(`${client.guilds.cache.size} servers`, {
        type: ActivityType.Watching,
      });
    }
  }, 5000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "ping") {
    SCping.execute(interaction);
  } else if (commandName === "emoji") {
    SCemoji.execute(interaction);
  } else if (commandName === "sticker") {
    SCsticker.execute(interaction);
  } else if (commandName === "pack") {
    SCpack.execute(interaction);
  } else if (commandName === "custom-pack") {
    SCcustompack.execute(interaction, client);
  } else if (commandName === "website") {
    SCwebsite.execute(interaction);
  } else if (commandName === "discord") {
    SCdiscord.execute(interaction);
  }
});

client.login(config.token);
