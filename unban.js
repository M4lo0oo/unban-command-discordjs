const { SlashCommandBuilder, IntentsBitField } = require('discord.js');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { execute } = require('../Utilities/ping');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user')
    .addUserOption(option => option.setName('user').setDescription('The member you want to unban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for unbanning this member').setRequired(true)),
    async execute(interaction, client) {

        const userID = interaction.options.getUser('user');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: "ou must have the ban members permission to use this command", ephemeral: true});
        if (interaction.member.id === userID) return await interaction.reply({ content: "You cannot ban yourself!", ephemeral: true});

        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason given";

        const embed = new EmbedBuilder()
        .setColor(0x0089D8)
        .setDescription(`:white_check_mark: <@${userID}> has been unbanned | ${reason}`)
        .setFooter({ text: 'Secury ©' });

        await interaction.guild.bans.fetch()
        .then(async bans => {

            if (bans.size == 0) return await interaction.reply({ content: "There is no one banned from this guild", ephemeral: true})
                let bannedID = bans.find(ban => ban.user.id == userID);
            if (!bannedID ) return await interaction.reply({ content: "The ID stated is not banned from the server", ephemeral: true})

                await interaction.guild.bans.remove(userID, reason).catch(err => {
                    return interaction.reply({ content: "I cannot unban this user"})
                })
        })

        await interaction.reply({ embeds: [embed] });
    }
}
