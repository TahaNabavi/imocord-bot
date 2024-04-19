const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('discord')
		.setDescription('دریافت لینک سرور دیسکورد'),
	async execute(interaction) {
		await interaction.reply('https://discord.gg/P8MratFnTV');
	},
};