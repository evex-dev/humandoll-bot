export function isURL(text: string) {
  try {
    new URL(text);
    return true;
  } catch (_) {
    return false;
  }
}
