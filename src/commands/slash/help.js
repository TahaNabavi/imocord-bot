const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("درباره ما"),
  async execute(interaction) {
    await interaction.reply({
      content: "",
      // ephemeral: true,
      embeds: [
        new EmbedBuilder()
          .setColor("White")
          .setDescription(
            "مجموعه ایموکورد بزرگترین منبع ایموجی،استیکر،بنر و ... در ایران هست"
          )
          .setTitle("وبسایت ما")
          .setURL("https://imocord.ir")
          .addFields(
            {
              name: "</emoji:1230543106609381498>",
              value: "** اضافه کردن ایموجی با استفاده از آیدی **",
              inline: true,
            },
            {
              name: "</sticker:1230572307412680824>",
              value: "** اضافه کردن استیکر با استفاده آیدی **",
              inline: true,
            },
            {
              name: "</pack:1230900478422945934>",
              value: "** اضافه کردن پک با استفاده از آیدی **",
              inline: true,
            },
            {
              name: "</custom-pack:1230596186201915463>",
              value: "** اضافه کردن ایموجی های ذخیره شده شما در وبسایت **",
              inline: true,
            },
            { name: "</website:1230602814171123822>", value: "** وبسایت ما **", inline: true },
            { name: "</discord:1230603281596940348>", value: "** دیسکورد ما **", inline: true },
            { name: "</emoji-mixer:1232337756072710184>", value: "** میکس کردن دو ایموجی با هم **", inline: true }
          ),
      ],
    });
  },
};
