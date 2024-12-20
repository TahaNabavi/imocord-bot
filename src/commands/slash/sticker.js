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
        PermissionsBitField.Flags.ManagestickersAndStickers
      )
    )
      return await interaction.reply({
        content: "",
        embeds: [
          new EmbedBuilder()
            .setColor("DarkRed")
            .setDescription("**شما دسترسی به آپلود استیکر را ندارید**")
            .setAuthor({
              name: "Imocord",
              iconURL: "https://s8.uupload.ir/files/37496-alert_r8ac.gif",
              url: "https://imocord.ir/s/sticker/" + itemId,
            })
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
          .setAuthor({
            name: "Imocord",
            iconURL: "https://s8.uupload.ir/files/9435-minecraft-xp-orb_oaua.gif",
            url: "https://imocord.ir/s/sticker//" + itemId,
          })
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
              .setAuthor({
                name: "Imocord",
                iconURL: "https://s8.uupload.ir/files/9435-minecraft-xp-orb_oaua.gif",
                url: "https://imocord.ir/s/sticker//" + itemId,
              })
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
                "**دریافت استیکر ناموفق بود**\n\nلطفا با پشتیبانی تماس بگیرید"
              )
              .setAuthor({
                name: "Imocord",
                iconURL: "https://s8.uupload.ir/files/1781-exclamation_kulo.png",
                url: "https://imocord.ir/s/sticker//" + itemId,
              })
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
        if (err.code == 30039) {
          interaction.editReply({
            content: "",
            embeds: [
              new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("**شما جای خالی برای آپلود استیکر ندارید**")
                .setAuthor({
                  name: "Imocord",
                  iconURL: "https://s8.uupload.ir/files/1781-exclamation_kulo.png",
                  url: "https://imocord.ir/s/sticker/" + itemId,
                })
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
                  "**استیکر وجود ندارد**"
                )
                .setAuthor({
                  name: "Imocord",
                  iconURL: "https://s8.uupload.ir/files/1781-exclamation_kulo.png",
                  url: "https://imocord.ir/s/sticker/" + itemId,
                })
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
            .setDescription(`**استیکر با موفقیت اضافه شد**`)
            .setAuthor({
              name: "Imocord",
              iconURL: "https://s8.uupload.ir/files/2767-yes_yks9.png",
              url: "https://imocord.ir/s/sticker/" + itemId,
            })
            .setFooter({
              text: `Requested by ${interaction.member.user.username}`,
              iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
            }),
        ],
      });
    }, 500);
  },
};
