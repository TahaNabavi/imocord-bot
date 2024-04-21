const { default: axios } = require("axios");
const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emoji")
    .setDescription("اضافه کردن ایموجی با ID")
    .addIntegerOption((Option) =>
      Option.setName("emoji_id").setDescription("ID ایموجی").setRequired(true)
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
            .setDescription("**شما دسترسی به آپلود ایموجی را ندارید**")
            .setFooter({
              text: `Imocord`,
            }),
        ],
      });

    const itemId = interaction.options.get("emoji_id").value;

    await interaction.reply({
      content: "",
      embeds: [
        new EmbedBuilder()
          .setColor("DarkPurple")
          .setDescription("**درحال دریافت ایموجی ``ID : " + itemId + "``**")
          .setFooter({
            text: `Requested by ${interaction.member.user.username}`,
            iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
          }),
      ],
    });

    let itemUrl = "";
    const getUrl = await axios
      .get(`https://imocord.ir/api/get-link/emoji/${itemId}`)
      .then(async function (response) {
        itemUrl = response.data;
        await interaction.editReply({
          content: "",
          embeds: [
            new EmbedBuilder()
              .setColor("DarkOrange")
              .setDescription(
                "**ایموجی با موفقیت دانلود شد در حال آپلود روی سرور**"
              )
              .setFooter({
                text: `Requested by ${interaction.member.user.username}`,
                iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
              }),
          ],
        });
      })
      .catch(function (error) {
        interaction.editReply({
          content: "",
          embeds: [
            new EmbedBuilder()
              .setColor("DarkRed")
              .setDescription(
                "**دریافت ایموجی ناموفق بود**\n\nلطفا با پشتیبانی تماس بگیرید"
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

    const res = await interaction.guild.emojis
      .create({ attachment: itemUrl, name: "imocord" })
      .catch((err) => {
        if (err.code == 30039) {
          interaction.editReply({
            content: "",
            embeds: [
              new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("**شما جای خالی برای آپلود ایموجی ندارید**")
                .setFooter({
                  text: `Requested by ${interaction.member.user.username}`,
                  iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
                }),
            ],
          });
        } else {
          interaction.editReply({
            content: "",
            embeds: [
              new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription(
                  "**آپلود ناموفق بود**\n دلایل رخ دادن:\n1.دسترسی نداشتن بات به آپلود در سرور\n2.وجود نداشتن ایموجی"
                )
                .setFooter({
                  text: `Requested by ${interaction.member.user.username}`,
                  iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
                }),
            ],
          });
        }

        return false;
      });

    if (res === false) return;

    setTimeout(() => {
      return interaction.editReply({
        content: "",
        embeds: [
          new EmbedBuilder()
            .setColor("DarkGreen")
            .setDescription(`**ایموجی با موفقیت اضافه شد** ${res}`)
            .setFooter({
              text: `Requested by ${interaction.member.user.username}`,
              iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
            }),
        ],
      });
    }, 500);
  },
};
