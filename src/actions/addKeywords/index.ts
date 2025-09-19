import { addkeywords } from "./queries";

export const createNewkeywords = async (KeywordData: {}) => {
  const keyword = await addkeywords(KeywordData);
  return keyword;
};
