import "jsr:@std/dotenv/load";
import { Client } from "npm:discord.js";
import { isURL } from "./utils/isURL.ts";
import { removeMention } from "./utils/removeMention.ts";
import { Tokenizer } from "./tokenizer/index.ts";
import { Database } from "./database/index.ts";
import { buildMarkovTable, generateMarkovChain } from "./markov/index.ts";

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
  if (message.content === "マルコフ") {
    const messages = await Database.list<[string, string]>({
      "prefix": ["messages"],
    });

    const messageMap = new Map();

    for await (const message of messages) {
      messageMap.set(message.value[0], message.value[1]);
    }

    const table = [...messageMap.entries()].reduce(
      (list, pairs) => [...list, ...pairs],
      [] as ([string, string] | undefined)[],
    ).filter((pair) => !!pair);

    const generatedMessage = generateMarkovChain(
      buildMarkovTable(table),
    );

    await message.reply(removeMention(generatedMessage) || "生成失敗");

    return;
  }

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
    {
        "expireIn": 1000 * 60 * 60 * 24 * 7
    }
  );
});

client.login(env["BOT_TOKEN"]);
