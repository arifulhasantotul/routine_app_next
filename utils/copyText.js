export const copyText = (text) => {
  if (text) {
    navigator.clipboard.writeText(text);
    alert(`Copied to clipboard ::::: ${text}`);
  } else {
    alert(`No text to copy`);
  }
}