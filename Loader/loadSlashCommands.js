const Discord = require('discord.js');
require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

module.exports = async bot => {

    let commands = [];

    //For each loaded command
    bot.commands.forEach(async command => {

        let slashCommand = new Discord.SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .setDMPermission(command.dm)
        // Put permission "Aucune" if no permission is given.
        .setDefaultMemberPermissions(command.permission === "Aucune" ? null : command.permission)

        if(command.options?.length >= 1) {
            for(let i = 0; i < command.options.length; i++) {
                //If it's a string, add command
                if(command.options[i].type === "STRING") {
                    slashCommand[`add${command.options[i].type.charAt(0).toUpperCase()
                        + command.options[i].type.slice(1).toLowerCase()}Option`]
                    (optionBuilder => 
                    optionBuilder.setName(command.options[i].name)
                    .setDescription(command.options[i].description)
                    .setAutocomplete(command.options[i].autocomplete)
                    .setRequired(command.options[i].required))
                }
                else{
                // Put in the format capital letter for first caracter. Then put name, description and required.
                slashCommand[`add${command.options[i].type.charAt(0).toUpperCase()
                    + command.options[i].type.slice(1).toLowerCase()}Option`]
                (optionBuilder => 
                optionBuilder.setName(command.options[i].name)
                .setDescription(command.options[i].description)
                .setRequired(command.options[i].required))
                }

            }
        }
        await commands.push(slashCommand);
    })
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    await rest.put(Routes.applicationCommands(bot.user.id), { body: commands })
    console.log(`Commande slash envoyée au serveur Discord.`);
}