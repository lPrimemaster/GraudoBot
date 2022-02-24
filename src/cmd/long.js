const { SlashCommandBuilder } = require('@discordjs/builders');
const { JoinChannel } = require('../utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('long')
		.setDescription('Does some cheeky business...'),
	async execute(interaction) {
		await interaction.reply('Yes.');
        await JoinChannel(interaction.member.voice.channel, '../res/short.mp3', 1);
	},
};
