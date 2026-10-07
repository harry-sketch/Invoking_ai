import { useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";

function App() {
  const [isThinking, setIsThinking] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!question.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
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
        }),
      });

      const data = await resp.json();

      setMessages((prev) => [
        ...prev,
        { role: "Assistant", content: data.response },
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
            <div key={Math.floor(Math.random + 10 * 200)}>
              <strong>
                {mesage.role === "user" ? "You: " : "Assistant: "}
              </strong>

              <ReactMarkdown>{mesage.content}</ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
