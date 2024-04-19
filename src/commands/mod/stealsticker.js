const { EmbedBuilder } = require("@discordjs/builders");
const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Steal sticker")
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(
      PermissionsBitField.Flags.ManageGuildExpressions
    )
    .setDMPermission(false),
  async execute(interaction) {
    async function sendMessage(message, edit) {
      if (!edit) {
        await interaction.reply({
          content: "",
          ephemeral: true,
          embeds: [new EmbedBuilder().setColor("Blue").setDescription(message)],
        });
      } else {
        await interaction.editReply({
          content: "",
          ephemeral: true,
          embeds: [new EmbedBuilder().setColor("Blue").setDescription(message)],
        });
      }
    }

    await sendMessage(`🌚 در حال دزدی ...`);

    const message = await interaction.channel.messages.fetch(
      interaction.targetId
    );
    const sticker = message.stickers.first();

    if (!sticker) return await sendMessage(`این که استیکر نیست !!!`, true);
    if (sticker.url.endsWith(".json"))
      return await sendMessage(`هممم. این استیکر معتبر نیست !!!`, true);

    var error;
    const created = await interaction.guild.stickers
      .create({
        name: sticker.name,
        description: sticker.description || "",
        tags: sticker.tags,
        file: sticker.url,
      })
      .catch(async (err) => {
        error = true;
        if (err.code == 30039)
          return await sendMessage(`استیکر های شما پره. !!!`, true);
        else return await sendMessage(`یه مشکل. منم نمیدونم چیه !!!`, true);
      });

    if (error) return;

    await sendMessage(`🌝 دزدی شما موفق بود. ${created.url}`, true);
  },
};
