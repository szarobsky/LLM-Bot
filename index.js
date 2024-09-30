const { Client, GatewayIntentBits } = require('discord.js');
const { OpenAI } = require('openai');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;  // Ignore bot messages
    if (message.content.startsWith('!ask')) {
        const question = message.content.replace('!ask', '').trim();
        if (!question) {
            return message.reply('Please provide a question.');
        }

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{"role": "user", "content": question}],
            });
            message.reply(response.choices[0].message);
            console.log(response.choices[0].message);
        } catch (error) {
            console.error(error);
            message.reply('There was an error processing your request.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);