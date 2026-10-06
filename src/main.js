import "dotenv/config";
import { groq } from "./clients/groq-client.js";
import { webSearch } from "./tools/web-search.js";

const main = async () => {
  const messages = [
    {
      role: "system",
      content: `You are an Iron-Man, a smart personal assistant who answers the asked questions. You have access to the following tools.
          1. webSearch({query}:{query:string})
          
          `,
    },

    {
      role: "user",
      content: "When was iphone 16 launched?",
    },
  ];
  try {
    while (true) {
      const completions = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        temperature: 0.2,
        messages: messages,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description:
                "Search the latest information and real-time data on the internet.",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The Search query to perform search on",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto",
      });

      messages.push(completions.choices[0].message);

      const tools = completions.choices[0].message.tool_calls;

      if (!tools) {
        console.log(`Assistant: ${completions.choices[0].message.content}`);
        break;
      }

      for (const tool of tools) {
        const functionName = tool.function.name;

        const args = tool.function.arguments;

        if (functionName === "webSearch") {
          const searchResult = await webSearch(JSON.parse(args));
          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: functionName,
            content: searchResult,
          });
        }
      }

      console.log(completions.choices[0].message.content);
    }
  } catch (error) {
    console.log("Something went wrong!!!", error);
  }
};

main();
