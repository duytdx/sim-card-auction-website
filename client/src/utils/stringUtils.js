export function formatBold(input) {
  // Replace words wrapped in ** with <b>word</b>
  return input.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
}
