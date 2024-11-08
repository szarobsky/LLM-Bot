# Discord ChatGPT Bot

This project is a Discord bot that integrates with OpenAI's GPT-4 model to answer questions asked in a Discord server.

## Adding Our Deployed Bot to Your Discord Server
Click the following link, select your server, and approve the permissions to add the [Discord Bot](https://discord.com/oauth2/authorize?client_id=1290347853713248419&permissions=67584&integration_type=0&scope=bot).


## Prerequisites

- Node.js (v18.18.0)
- npm (v10.8.2)
- A Discord bot token
- An OpenAI API key

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/discord-chatgpt-bot.git
    cd discord-chatgpt-bot
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your Discord bot token and OpenAI API key:
    ```env
    DISCORD_TOKEN=your-discord-token
    OPENAI_API_KEY=your-openai-api-key
    ```

## Usage

1. Start the bot:
    ```sh
    node index.js
    ```

2. Invite the bot to your Discord server and use the `!ask` command followed by your question:
    ```
    !ask What is the capital of France?
    ```

## Project Structure

- `index.js`: Main file that initializes the Discord bot and handles message events.
- `.env`: Environment variables file (ignored by Git).
- `package.json`: Project metadata and dependencies.
- `package-lock.json`: Lockfile for npm to ensure consistent installs.
- `.gitignore` Specifies files and directories to be ignored by Git.

## Dependencies

- `discord.js`: A powerful library for interacting with the Discord API.
- `dotenv`: A module to load environment variables from a `.env` file.
- `openai`: OpenAI API client.