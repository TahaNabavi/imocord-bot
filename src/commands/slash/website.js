const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('website')
		.setDescription('دریافت لینک وبسایت'),
	async execute(interaction) {
		await interaction.reply('https://imocord.ir');
	},
};