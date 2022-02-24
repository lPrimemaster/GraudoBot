const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('debug')
		.setDescription('Enables / disables debug.')
        .setDefaultPermission(true)
        .addBooleanOption(option => option.setName('input').setDescription('Enable or disable debugging.').setRequired(true)),
	async execute(interaction) {
        if(interaction.options.getBoolean('input'))
        {
            await interaction.reply('Debug mode enabled.');
        }
        else
        {
            await interaction.reply('Debug mode disabled.');
        }
	}
};