const { SlashCommandBuilder } = require('@discordjs/builders');
const { JoinChannel } = require('../utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eggs')
		.setDescription('Cook them for me.'),
	async execute(interaction) {
		await interaction.reply('Cooking...');
        await JoinChannel(interaction.member.voice.channel, '../res/eggs.mp3', 1);
	},
};
