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

//Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

//Start the server
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

    //If the message is a reply to the bot, the bot will respond to the question
    if (message.reference) {
        try {
            const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
            if (referencedMessage.author.id === client.user.id) {
                console.log("Reply to bot detected");
                message.channel.sendTyping();
                
                //The original message from the user is found
                let loopMessage = referencedMessage;
                while (loopMessage.reference) {
                    loopMessage = await message.channel.messages.fetch(loopMessage.reference.messageId);
                }
                const originalMessage = loopMessage;

                try {
                    let threadMessages = [];
                    const messages = await message.channel.messages.fetch({ limit: 100 });
        
                    //All messages in the thread that followed the original message are collected
                    for (const msg of messages.values()) {
                        if (msg.reference) {
                            let loopMessage = msg;
                            while (loopMessage.reference) {
                                loopMessage = await message.channel.messages.fetch(loopMessage.reference.messageId);
                            }
                            if (loopMessage.id === originalMessage.id) {
                                threadMessages.push(msg);
                            }
                        }
                    }
        
                    //The original message is added to the thread of messages
                    threadMessages.push(originalMessage);
        
                    //The messages are sorted by time
                    threadMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        
                    //The conversation log is formatted, and the prompt is created for the OpenAI API
                    let conversationLog = threadMessages.map(msg => `**${msg.author.tag}:** ${msg.content}`).join("\n");
                    let request = `Here’s the full interaction:\n${conversationLog}`;
                    request += "\n\nPlease answer the following question/interact with the user as if you are teaching a student, and only use text formatting. Also, do not end the message prompting another question: ";

                    //Call the OpenAI API to get the response
                    try {
                        const response = await openai.chat.completions.create({
                            model: "gpt-4o-mini",
                            messages: [{"role": "user", "content": request}],
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
                } catch (error) {
                    console.error("Error retrieving message thread:", error);
                    message.reply("I couldn't retrieve the full conversation.");
                }
            }
        } catch (error) {
            console.error(error);
            message.reply("I couldn't retrieve the referenced message.");
        }
        return;
    }

    //If the message starts with !options, the bot will respond with the available options
    if (message.content.startsWith('!options')) {
        message.channel.sendTyping();
        console.log("options asked");
        let reply = "Hello! I am available to help you with the following commands:\n- !ask (your question): Answers the question in an educational manner\n- !activity (your question): Generates an activity related to the question\n- !flashcard (your topic): Creates flashcards for the topic\n- !examples (your topic): Generates examples for the topic\n- !mcq (your topic): Generates multiple-choice questions for the topic\nFeel free to reply to any of my responses to ask more questions!";
        message.reply(reply);
        return;
    }

    //If the message starts with !ask, the bot will respond to the question
    if (message.content.startsWith('!ask')) {
        message.channel.sendTyping();
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

    //If the message starts with !flashcard, the bot will make flashcards about the requested topic.
    if (message.content.startsWith('!flashcard')) {
        console.log("flashcard question asked");
        message.channel.sendTyping();

        //Get the question from the message
        let question = "Please create flashcards about the following topic as if you are teaching a student, and only use text formatting. Also, do not end the messsage prompting another question: ";
        question += message.content.replace('!ask', '').trim();
        if (!question) {
            return message.reply('Please provide a topic.');
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
        console.log("activity question asked");
        message.channel.sendTyping();

        //Get the question from the message
        let question = "Please create a task/activity the user can take to answer the following question as if you are teaching a student, and only use text formatting. Also, do not end the message prompting another question: ";
        question += message.content.replace('!activity', '').trim();
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

    //If the message starts with !examples, the bot will give examples of the referenced topic.
    if (message.content.startsWith('!examples')) {
        console.log("example question asked");
        message.channel.sendTyping();

        //Get the question from the message
        let question = "Please give examples of the following topic as if you are teaching a student, and only use text formatting. Also, do not end the message prompting another question: ";
        question += message.content.replace('!examples', '').trim();
        if (!question) {
            return message.reply('Please provide a topic.');
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

    //If the message starts with !mcq, the bot will give examples of the referenced topic.
    if (message.content.startsWith('!mcq')) {
        console.log("mcq question asked");
        message.channel.sendTyping();

        //Get the question from the message
        let question = "Please generate multiple choice practice questions for the following topic as if you are teaching a student, and only use text formatting. Include the answers for the questions at the very end. Also, do not end the message prompting another question: ";
        question += message.content.replace('!mcq', '').trim();
        if (!question) {
            return message.reply('Please provide a topic.');
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