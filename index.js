//Modules are imported
const { Client, GatewayIntentBits } = require('discord.js');
const { OpenAI } = require('openai');
require('dotenv').config();
const express = require('express');

//Create a new Discord client and OpenAI client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//When the bot is ready, log the bot's username
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//When a message is sent, the bot will detect it
client.on('messageCreate', async (message) => {
    //If the message is from a bot, ignore it
    if (message.author.bot) return; 

    //If the message starts with !ask, the bot will respond to the question
    if (message.content.startsWith('!ask')) {
        console.log("question asked");

        //Get the question from the message
        let question = "Please answer the following question/interact with the user as if you are teaching a student, and only use text formatting. Also, do not end the messsage prompting another question: ";
        question += message.content.replace('!ask', '').trim();
        if (!question) {
            return message.reply('Please provide a question.');
        }

        //Call the OpenAI API to get the response
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{"role": "user", "content": question}],
            });
            const reply = response.choices[0].message.content;
            if (reply.length <= 2000) {
                message.reply(reply);
            } else {
                //Split the reply into chunks to avoid the 2000 character limit
                const chunks = reply.match(/[\s\S]{1,2000}/g); 
                for (const chunk of chunks) {
                    await message.reply(chunk);
                }
            }
        } catch (error) {
            console.error(error);
            message.reply('There was an error processing your request.');
        }
    }

    //If the message starts with !flashcard, the bot will make flashcards to respond to the question
    if (message.content.startsWith('!flashcard')) {
        console.log("flashcard question asked");

        //Get the question from the message
        let question = "Please create flashcards to answer the following question/interact with the user as if you are teaching a student, and only use text formatting. Also, do not end the messsage prompting another question: ";
        question += message.content.replace('!ask', '').trim();
        if (!question) {
            return message.reply('Please provide a question.');
        }

        //Call the OpenAI API to get the response
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{"role": "user", "content": question}],
            });
            const reply = response.choices[0].message.content;
            if (reply.length <= 2000) {
                message.reply(reply);
            } else {
                //Split the reply into chunks to avoid the 2000 character limit
                const chunks = reply.match(/[\s\S]{1,2000}/g); 
                for (const chunk of chunks) {
                    await message.reply(chunk);
                }
            }
        } catch (error) {
            console.error(error);
            message.reply('There was an error processing your request.');
        }
    }

    //If the message starts with !activity, the bot will make an activity to respond to the question
    if (message.content.startsWith('!activity')) {
        console.log("task question asked");

        //Get the question from the message
        let question = "Please create a task/activity the user can take to answer the following question as if you are teaching a student, and only use text formatting. Also, do not end the message prompting another question: ";
        question += message.content.replace('!ask', '').trim();
        if (!question) {
            return message.reply('Please provide a question.');
        }

        //Call the OpenAI API to get the response
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{"role": "user", "content": question}],
            });
            const reply = response.choices[0].message.content;
            if (reply.length <= 2000) {
                message.reply(reply);
            } else {
                //Split the reply into chunks to avoid the 2000 character limit
                const chunks = reply.match(/[\s\S]{1,2000}/g); 
                for (const chunk of chunks) {
                    await message.reply(chunk);
                }
            }
        } catch (error) {
            console.error(error);
            message.reply('There was an error processing your request.');
        }
    }
});

//Login to Discord with the bot token
client.login(process.env.DISCORD_TOKEN);