import "jsr:@std/dotenv/load";
import { Client } from "npm:discord.js";
import { isURL } from "./utils/isURL.ts";
import { Tokenizer } from "./tokenizer/index.ts";
import { Database } from "./database/index.ts";

const env = Deno.env.toObject();

const client = new Client({
    "intents": [
        "Guilds",
        "GuildMessages",
        "MessageContent",
    ],
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("messageCreate", async (message) => {
    if (
        message.content.length > 180 || message.content.length < 3 ||
        message.author.bot || isURL(message.content)
    ) {
        return;
    }
    const tokenized = await Tokenizer.tokenize(message.content);

    await Database.set(
        ["messages", message.id],
        tokenized.map((
            token: Record<string, string | number>,
        ) => [token.surface_form, token.pos]),
    );

    const list = (await Database.list({
        "prefix": ["messages"],
    }));

    for await (const value of list) {
        console.log(value);
    }
});

client.login(env["BOT_TOKEN"]);
