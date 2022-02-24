const youtubedl = require('youtube-dl-exec');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { JoinChannel, filter } = require('../utils');
const request = require('request');
const { join } = require('path/posix');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays youtube url.')
        .addStringOption(option => option.setName('url').setDescription('Video url.').setRequired(true)),
	async execute(interaction) {
        var url = interaction.options.getString('url');
        await interaction.reply('Im on it!');
        var msg = await interaction.channel.send({
            content: 'Loading...',
            files: [{
              attachment: join(__dirname, '../res/loading_tiny.gif'),
              name: 'loading_tiny.gif'
            }]
        });

        // TODO: Try catch this
        youtubedl(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true,
            referer: url
        }).then(output => {
            // console.log(output.requested_formats);
            const surl = filter(output.requested_formats, (e) => {
                if(e.format_id == '251' || e.format_id == '140')
                    return true;
                return false;
            })[0].url;

            var audio_res = request(surl);
            JoinChannel(interaction.member.voice.channel, audio_res, 1, false);

            msg.delete();
            interaction.channel.send('Found: ' + output.title);
        });
	},
};
