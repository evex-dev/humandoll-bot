export function removeMention(text: string) {
  return text.replaceAll("@everyone", "@_everyone").replaceAll(
    "@here",
    "@_here",
  );
}
