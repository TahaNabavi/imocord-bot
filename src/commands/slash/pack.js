const { default: axios } = require("axios");
const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pack")
    .setDescription("اضافه کردن پک با ID")
    .addIntegerOption((Option) =>
      Option.setName("pack_id").setDescription("ID پک").setRequired(true)
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

    const itemId = interaction.options.get("pack_id").value;

    await interaction.reply({
      content: "",
      embeds: [
        new EmbedBuilder()
          .setColor("DarkPurple")
          .setDescription("**درحال دریافت پک ``ID : " + itemId + "``**")
          .setFooter({
            text: `Requested by ${interaction.member.user.username}`,
            iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`,
          }),
      ],
    });

    let itemsId = "";

    const getUrl = await axios
      .get(`https://imocord.ir/api/pack/${itemId}`)
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
            .setDescription("**پک مورد نظر یافت نشد**")
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
