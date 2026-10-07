import { tavilyClient } from "../clients/tavily-client.js";

export const webSearch = async ({ query }) => {
  try {
    const resp = await tavilyClient.search(query, { maxResults: 3 });

    const finalResult = resp.results.map(({ content }) => content).join("\n\n");

    return finalResult;
  } catch (error) {
    console.log("Someting went wrong in web-saearch-tool", error);
  }
};
