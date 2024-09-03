export function buildMarkovTable(
  pairs: [string, string][],
): Record<string, string[]> {
  const table: Record<string, string[]> = {};

  pairs.forEach(([word, pos]) => {
    if (!table[pos]) {
      table[pos] = [];
    }
    table[pos].push(word);
  });

  return table;
}

export function generateMarkovChain(
  table: Record<string, string[]>,
  startPos: string = "副詞",
  maxLength: number = 400,
): string {
  const result: string[] = [];
  let currentPos: string = startPos;
  let wordCount = 0;

  while (wordCount < maxLength) {
    const possibleWords = table[currentPos];

    if (!possibleWords || possibleWords.length === 0) {
      break;
    }

    const randomWord =
      possibleWords[Math.floor(Math.random() * possibleWords.length)];
    result.push(randomWord);
    wordCount++;

    const stopProbability = Math.pow(1.25, wordCount);
    if (Math.random() * 100 < stopProbability) {
      break;
    }

    currentPos = getNextPos(currentPos, table);

    if (currentPos === "助動詞" && table["記号"]) {
      if (Math.random() < 0.05) {
        const symbol = table["記号"]
          ?.[Math.floor(Math.random() * table["記号"].length)];
        if (symbol) {
          result.push(symbol);
        }
      }
    }
  }

  return result.join("");
}

function getNextPos(
  currentPos: string,
  table: Record<string, string[]>,
): string {
  switch (currentPos) {
    case "副詞":
      return table["名詞"] ? "名詞" : "動詞";
    case "名詞":
      return table["助詞"] ? "助詞" : "動詞";
    case "助詞":
      return table["動詞"] ? "動詞" : "助動詞";
    case "動詞":
      return table["助動詞"] ? "助動詞" : "形容詞";
    case "形容詞":
      return table["名詞"] ? "名詞" : "動詞";
    case "助動詞":
      return table["記号"] ? "記号" : "名詞";
    default:
      return "記号";
  }
}
