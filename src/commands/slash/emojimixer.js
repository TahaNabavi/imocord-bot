const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");




const onlyEmoji = require("emoji-aware").onlyEmoji;
const superagent = require("superagent");
const config = require("../../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emoji-mixer")
    .setDescription("ترکیب دو ایموجی")
    .addStringOption((option) =>
      option
        .setName("emojis")
        .setDescription("دو تا ایموجی انتخاب کنید")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const { options } = interaction;
    const eString = options.getString("emojis");
    const input = onlyEmoji(eString);

    const response = `فقط ایموجی های پیشفرض مجاز می باشد`;

    const output = await superagent
      .get("https://tenor.googleapis.com/v2/featured")
      .query({
        key: config.tenorAPI,
        contentfilter: "high",
        media_filter: "png_transparent",
        component: "proactive",
        collection: "emoji_kitchen_v5",
        q: input.join("_"),
      })
      .catch((err) => {});

    if (!output) {
      return await interaction.editReply({ content: response });
    } else if (!output.body.results[0]) {
      return await interaction.editReply({ content: response });
    } else if (eString.stratsWith("<") || eString.endsWith(">")) {
      return await interaction.editReply({ content: response });
    }

    return await interaction.editReply({
      embeds: [new EmbedBuilder().setImage(output.body.results[0].url)],
    });
  },
};
