const { SlashCommandBuilder } = require('@discordjs/builders');
const { LeaveChannel } = require('../utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops audio and leaves the room.'),
	async execute(interaction) {
        await interaction.reply('=[');
        LeaveChannel(interaction.member.voice.channel);
	},
};
