const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioResource, createAudioPlayer, VoiceConnectionStatus, entersState, joinVoiceChannel } = require('@discordjs/voice');
const { JoinChannel } = require('../utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('longlong')
		.setDescription('Does some cheekier business...'),
	async execute(interaction) {
		await interaction.reply('Yes.');
        await JoinChannel(interaction.member.voice.channel, '../res/long.mp3', 1);
	},
};
