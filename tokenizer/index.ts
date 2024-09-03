import kuromoji from "npm:kuromoji";

function buildTokenizer() {
  return new Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>>(
    (resolve, reject) => {
      kuromoji.builder({ dicPath: "./dict" }).build(
        (
          err: Error,
          tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures>,
        ) => {
          if (err) {
            reject(err);
          } else {
            resolve(tokenizer);
          }
        },
      );
    },
  );
}

export const Tokenizer = await buildTokenizer();
