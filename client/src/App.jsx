import { useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const conversationId =
  Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

function App() {
  const [isThinking, setIsThinking] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!question.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      },
    ]);

    setIsThinking(true);

    try {
      const resp = await fetch("http://localhost:6969/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          conversationId,
        }),
      });

      const data = await resp.json();

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "Assistant", content: data.messages },
      ]);

      setQuestion("");
    } catch (error) {
      console.log("Something went wrong", error);
    } finally {
      setIsThinking(false);
    }
  };
  return (
    <div>
      <h1>Iron Man AI</h1>

      <div>
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          value={question}
          type="text"
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything..."
        />
        <br />
        <button type="button" onClick={handleSend}>
          Send
        </button>

        <div>
          {isThinking && <div>🧠 Thinking...</div>}

          {messages.map((mesage) => (
            <div key={mesage.id}>
              <strong>
                {mesage.role === "user" ? "You: " : "Assistant: "}
              </strong>

              <ReactMarkdown rehypePlugins={[remarkGfm]}>
                {mesage.content}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
