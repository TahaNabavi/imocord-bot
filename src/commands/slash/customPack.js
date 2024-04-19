const { default: axios } = require("axios");
const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("custom-pack")
    .setDescription("اضافه کردن ایموجی های ذخیره شدا در وبسایت"),
  async execute(interaction, client) {
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

    await interaction.reply({
      content: "",
      embeds: [
        new EmbedBuilder()
          .setColor("DarkPurple")
          .setDescription(
            "**دریافت ایموجی ها ``USER_ID : " +
              interaction.member.user.username +
              "``**"
          )
          .setFooter({
            text: `Requested by ${interaction.member.user.username}`,
            iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
          }),
      ],
    });

    let itemsId = "";

    const getUrl = await axios
      .get(`https://imocord.ir/api/custom-pack/${interaction.member.user.id}`)
      .then(async function (response) {
        itemsId = response.data;
        await interaction.editReply({
          content: "",
          embeds: [
            new EmbedBuilder()
              .setColor("DarkOrange")
              .setDescription(
                "**پک با موفقیت دانلود شد در حال آپلود روی سرور**"
              )
              .setFooter({
                text: `Requested by ${interaction.member.user.id}`,
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
                "**دریافت پک ناموفق بود**\n\nلطفا با پشتیبانی تماس بگیرید"
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
    if (itemsId == 404 || itemsId == "") {
      return interaction.editReply({
        content: "",
        embeds: [
          new EmbedBuilder()
            .setColor("DarkRed")
            .setAuthor({
              name: "LOGIN",
              iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}`,
              url: "https://imocord.ir",
            })
            .setDescription("**شما در وبسایت ثبت نام نکرده اید**")
            .setFooter({
              text: `Requested by ${interaction.member.user.username}`,
              iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
            }),
        ],
      });
    }else if (itemsId == 444){
        return interaction.editReply({
            content: "",
            embeds: [
              new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription("**شما هیچ ایموجی ای ذخیره نکرده اید**")
                .setFooter({
                  text: `Requested by ${interaction.member.user.username}`,
                  iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
                }),
            ],
          });
    } else {
      let itemsUrl = [];
      let tr = 0;
      let fa = 0;

      const downloadAndUploadEmojis = async (interaction, itemsId) => {
        try {
          for (const it of itemsId) {
            const response = await axios.get(
              `https://imocord.ir/api/get-link/emoji/${it}`
            );
            itemsUrl.push(response.data);
          }

          await interaction.editReply({
            content: "",
            embeds: [
              new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription(
                  `**بارگیری ایموجی ها موفق بود.درحال آپلود \`\`length : ${itemsUrl.length}\`\`**`
                )
                .setFooter({
                  text: `Requested by ${interaction.member.user.username}`,
                  iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
                }),
            ],
          });

          for (const itu of itemsUrl) {
            const st = await interaction.guild.emojis
              .create({ attachment: itu, name: "imocord" })
              .catch((err) => {
                return false;
              });

            if (st === false) {
              fa++;
            } else {
              tr++;
            }
          }

          await interaction.editReply({
            content: "",
            embeds: [
              new EmbedBuilder()
                .setColor("DarkRed")
                .setDescription(
                  `**آپلود تمام شد\n\nتعداد کل : \`\`${itemsUrl.length}\`\` \n موفق : \`\`${tr}\`\` \n ناموفق : \`\`${fa}\`\`**`
                )
                .setFooter({
                  text: `Requested by ${interaction.member.user.username}`,
                  iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
                }),
            ],
          });
        } catch (error) {
          console.error(error);
        }
      };

      downloadAndUploadEmojis(interaction, itemsId);
    }
  },
};
