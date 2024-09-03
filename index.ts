import "jsr:@std/dotenv/load";
import { Client } from "npm:discord.js";

const env = Deno.env.toObject();

const client = new Client({
    "intents": [
        "GuildMessages",
        "MessageContent"
    ]
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("messageCreate", (message) => {
    console.log(message.content);
    if (message.content === "!ping") {
        message.reply("Pong!");
    }
});

client.login(env["BOT_TOKEN"]);
