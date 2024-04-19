const {
  SlashCommandBuilder,
  EmbedBuilder,
  Routes,
  DataResolver,
} = require("discord.js");

module.exports = {
  owner: true,
  data: new SlashCommandBuilder()
    .setName("change-bot-banner")
    .setDescription("change bot banner")
    .addAttachmentOption((option) =>
      option.setName("banner").setDescription("your banner").setRequired(true)
    ),
  async execute(interaction, client) {
    const banner = interaction.options.getAttachment("banner");
    
    interaction.deferReply({ ephemeral: true });

    async function sendMessage(message) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder().setColor("Blurple").setDescription(message),
        ],
        ephemeral: true,
      });
    }

    if (
      banner.contentType !== "image/gif" &&
      banner.contentType !== "image/jpg" &&
      banner.contentType !== "image/jpeg" &&
      banner.contentType !== "image/png"
    )
      return await sendMessage("just GIF,PNG,JPG format");

    var error;
    await client.rest
      .patch(Routes.user(), {
        body: { banner: await DataResolver.resolveImage(banner.url) },
      })
      .catch(async (err) => {
        error = true;
        await sendMessage(err.toString());
      });

    if (error) return;

    await sendMessage("done");
  },
};
