/* INFOS
Pour rajouter des valeurs par défaut sur les membres, c'est dans Commands/add.js

*/

//HEALTH CHECK UP DE L'APPLICATION
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000; // Utilisez la variable d'environnement PORT fournie par Heroku ou un port par défaut

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Le serveur est en écoute sur le port ${PORT}`);
});
//FIN DE HEALTH CHECK UP DE L'APPLICATION

const lockFilePath = path.join(__dirname, 'lockfile');

// Fonction pour vérifier si le verrou existe
function isLocked() {
    return fs.existsSync(lockFilePath);
}

// Fonction pour créer le verrou
function lock() {
    fs.writeFileSync(lockFilePath, 'locked');
}

// Fonction pour supprimer le verrou
function unlock() {
    if (isLocked()) {
        fs.unlinkSync(lockFilePath);
    }
}
if (isLocked()) {
    console.log('Le processus est déjà verrouillé.');
} else {
    console.log('Verrouillage du démarrage du bot...');
    lock();
}

require('dotenv').config();

const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799) // Indents used for the bot
const bot = new Discord.Client({intents});

const loadCommands = require('./Loader/loadCommands');
const loadEvents = require('./Loader/loadEvents');
const loadDatabase = require('./Loader/loadDatabase');

const loadSlashCommands = require('./Loader/loadSlashCommands');

const timestamp = new Date().toISOString();

bot.color = "#95A5A6" // Set bot color

bot.commands = new Discord.Collection(); // Create collection of commands
bot.function = {
    //All functions of bot should go here
    linkGuildDB: require('./Helpers/checkGuildComponent')
}

console.log(timestamp + ': Connexion à Discord...')
bot.login(process.env.DISCORD_TOKEN); // Login to Discord
console.log('Connexion validée !')


bot.db = loadDatabase()

loadCommands(bot); // Load all commands in collection, to the bot
loadEvents(bot); // Load all commands in collection, to the bot

// Quand le bot est prêt et connecté
bot.on('ready', () => {
    console.log(`Bot opérationnel sous le nom: ${bot.user.tag}!`);

    // Load slash commands
    loadSlashCommands(bot);
});

// UPDATE FUNCTION
const updateFunction = require('./Helpers/updateFunction');
updateFunction();

// Quand un membre change de role
const handleRoleChange = require('./Events/handleRoleChange');
bot.on('guildMemberUpdate', (oldMember, newMember) => {
  handleRoleChange(bot, oldMember, newMember);
});


//When bot join a guild
bot.on('guildCreate', async (guild) => {
    await bot.function.linkGuildDB(bot, guild);
});


console.log('Déverrouillage du démarrage du bot...');
unlock();


/* POUR LE DEVELOPPMENT UNIQUMENT
const downloadGitWebsite = require('./Helpers/downloadGitWebsite');
downloadGitWebsite('https://github.com/Satalis/LOUTRES_SITE/', './devWebsite')*/