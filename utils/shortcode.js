import { customAlphabet } from "nanoid";

 const alphabet =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

 const generateShortcode = () => {
  const nanoid = customAlphabet(alphabet, 6);
  return nanoid();
};

export default generateShortcode;
