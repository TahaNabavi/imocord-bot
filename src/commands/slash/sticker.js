const { default: axios } = require("axios");
const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sticker")
    .setDescription("اضافه کردن استیکر با ID")
    .addIntegerOption((Option) =>
      Option.setName("sticker_id").setDescription("ID استیکر").setRequired(true)
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageEmojisAndStickers
      )
    )
      return await interaction.reply({
        content: "",
        embeds: [
          new EmbedBuilder()
            .setColor("DarkRed")
            .setDescription("**شما دسترسی به آپلود استیکر را ندارید**")
            .setFooter({
              text: `Imocord`,
            }),
        ],
      });

    const itemId = interaction.options.get("sticker_id").value;

    await interaction.reply({
      content: "",
      embeds: [
        new EmbedBuilder()
          .setColor("DarkPurple")
          .setDescription("**درحال دریافت استیکر ``ID : " + itemId + "``**")
          .setFooter({
            text: `Requested by ${interaction.member.user.username}`,
            iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
          }),
      ],
    });

    let itemUrl = "";
    const getUrl = await axios
      .get(`https://imocord.ir/api/get-link/sticker/${itemId}`)
      .then(async function (response) {
        itemUrl = response.data;
        await interaction.editReply({
          content: "",
          embeds: [
            new EmbedBuilder()
              .setColor("DarkOrange")
              .setDescription(
                "**استیکر با موفقیت دانلود شد در حال آپلود روی سرور**"
              )
              .setFooter({
                text: `Requested by ${interaction.member.user.username}`,
                iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
              }),
          ],
        });
      })
      .catch(function (error) {
        console.warn(error);
        interaction.editReply({
          content: "",
          embeds: [
            new EmbedBuilder()
              .setColor("DarkRed")
              .setDescription(
                "**دریافت استیکر ناموفق بود**\n\nلطفا با پشتیبانی تماس بگیرید"
              )
              .setFooter({
                text: `Requested by ${interaction.member.user.username}`,
                iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
              }),
          ],
        });
        return false;
      });

    if (getUrl === false) return;

    const res = await interaction.guild.stickers
      .create({ file: itemUrl, name: "imocord" })
      .catch((err) => {
        console.log(err);
        interaction.editReply({
          content: "",
          embeds: [
            new EmbedBuilder()
              .setColor("DarkRed")
              .setDescription(
                "**آپلود ناموفق بود**\n دلایل رخ دادن:\n1.دسترسی نداشتن بات به آپلود در سرور\n2.نبودن جای خالی برا آپلود استیکر\n3.وجود نداشتن استیکر"
              )
              .setFooter({
                text: `Requested by ${interaction.member.user.username}`,
                iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
              }),
          ],
        });
        return false;
      });

    if (res === false) return;
    
    setTimeout(() => {
      return interaction.editReply({
        content: "",
        embeds: [
          new EmbedBuilder()
            .setColor("DarkGreen")
            .setDescription(`**استیکر با موفقیت اضافه شد**`)
            .setFooter({
              text: `Requested by ${interaction.member.user.username}`,
              iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
            }),
        ],
      });
    }, 500);
  },
};
