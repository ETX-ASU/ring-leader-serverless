const generateUniqueString = (length: number, signed: boolean): string => {
  let uniqueString = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    uniqueString += possible.charAt(
      Math.floor(Math.random() * possible.length)
    );
  }
  if (signed) {
    //TODO: if signed === true, sign the string with our private key
  }
  return uniqueString;
};
export { generateUniqueString };
