import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bot,
  Sparkles,
  Send,
  ArrowLeft,
  User,
} from "lucide-react";

import players from "../data/players.js";

function AIAnalyst({ onBack }) {
  const [playerA, setPlayerA] = useState(players[0]);
  const [playerB, setPlayerB] = useState(players[1]);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Used to create stable message IDs
  // without calling Date.now() during render.
  const messageId = useRef(0);

  // Used to automatically scroll to the latest message.
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "Who is more consistent?",
    "Compare their batting styles.",
    "Who has better overall numbers?",
    "Who would you choose in a T20?",
  ];

  // Scroll to latest message whenever the conversation changes.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Clean Gemini markdown from the response.
  const cleanAnswer = (text) => {
    if (!text) {
      return "";
    }

    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^[-•]\s*/gm, "• ");
  };

  const handleQuestion = async (selectedQuestion) => {
    const trimmedQuestion = selectedQuestion.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    // Clear input immediately.
    setQuestion("");

    // Show user message immediately.
    const userMessage = {
      id: ++messageId.current,
      type: "user",
      text: trimmedQuestion,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playerA,
            playerB,
            question: trimmedQuestion,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "AI request failed."
        );
      }

      // Add AI response as the next chat message.
      const aiMessage = {
        id: ++messageId.current,
        type: "ai",
        text: cleanAnswer(data.answer),
      };

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);
    } catch (error) {
      console.error(
        "AI Analyst error:",
        error
      );

      const errorMessage = {
        id: ++messageId.current,
        type: "ai",
        text:
          error.message ||
          "The AI Analyst is temporarily unavailable. Please try again.",
        error: true,
      };

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerChange = (setter, value) => {
    const selected = players.find(
      (player) =>
        player.id === Number(value)
    );

    if (!selected) {
      return;
    }

    setter(selected);

    // Start a fresh conversation for the new matchup.
    setMessages([]);
    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="ai-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="ai-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="ai-title">

          <div className="ai-icon">
            <Bot size={24} />
          </div>

          <div>
            <p className="section-label">
              CRICKET INTELLIGENCE
            </p>

            <h1>
              AI Cricket Analyst
            </h1>
          </div>

        </div>

        <div className="ai-status">
          <span className="status-dot"></span>
          AI Analyst
        </div>

      </div>

      {/* =========================
          MAIN
      ========================= */}

      <main className="ai-content">

        <p className="ai-description">
          Ask questions about two players and get
          data-driven cricket insights.
        </p>

        {/* =========================
            PLAYER SELECTION
        ========================= */}

        <section className="ai-card">

          <div className="ai-player-grid">

            {/* PLAYER A */}

            <div>

              <label>
                PLAYER A
              </label>

              <select
                value={playerA.id}
                onChange={(e) =>
                  handlePlayerChange(
                    setPlayerA,
                    e.target.value
                  )
                }
              >
                {players.map((player) => (
                  <option
                    key={player.id}
                    value={player.id}
                  >
                    {player.name}
                  </option>
                ))}
              </select>

              <div className="ai-player-info">
                <strong>
                  {playerA.name}
                </strong>

                <span>
                  {playerA.role}
                </span>
              </div>

            </div>

            {/* VS */}

            <div className="ai-vs">
              VS
            </div>

            {/* PLAYER B */}

            <div>

              <label>
                PLAYER B
              </label>

              <select
                value={playerB.id}
                onChange={(e) =>
                  handlePlayerChange(
                    setPlayerB,
                    e.target.value
                  )
                }
              >
                {players.map((player) => (
                  <option
                    key={player.id}
                    value={player.id}
                  >
                    {player.name}
                  </option>
                ))}
              </select>

              <div className="ai-player-info">
                <strong>
                  {playerB.name}
                </strong>

                <span>
                  {playerB.role}
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* =========================
            CHAT AREA
        ========================= */}

        <section className="chat-section">

          {/* Welcome screen */}

          {messages.length === 0 && !loading && (
            <div className="chat-welcome">

              <div className="welcome-icon">
                <Sparkles size={22} />
              </div>

              <h2>
                Cricket Insight
              </h2>

              <p>
                Ask me anything about{" "}
                <strong>
                  {playerA.name}
                </strong>{" "}
                and{" "}
                <strong>
                  {playerB.name}
                </strong>.
              </p>

            </div>
          )}

          {/* =========================
              MESSAGES
          ========================= */}

          <div className="chat-messages">

            {messages.map((message) => (

              <div
                key={message.id}
                className={`chat-message ${
                  message.type === "user"
                    ? "user-message"
                    : "ai-message"
                }`}
              >

                {/* Avatar */}

                <div className="message-avatar">

                  {message.type === "user" ? (
                    <User size={17} />
                  ) : (
                    <Sparkles size={17} />
                  )}

                </div>

                {/* Message */}

                <div className="message-content">

                  <span className="message-name">
                    {message.type === "user"
                      ? "You"
                      : "Cricktics AI"}
                  </span>

                  <div
                    className={`message-bubble ${
                      message.error
                        ? "error-bubble"
                        : ""
                    }`}
                  >
                    {message.text}
                  </div>

                </div>

              </div>

            ))}

            {/* =========================
                AI THINKING
            ========================= */}

            {loading && (
              <div className="chat-message ai-message">

                <div className="message-avatar">
                  <Sparkles size={17} />
                </div>

                <div className="message-content">

                  <span className="message-name">
                    Cricktics AI
                  </span>

                  <div className="message-bubble loading-bubble">

                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>

                    <span className="thinking-text">
                      Analyzing...
                    </span>

                  </div>

                </div>

              </div>
            )}

            {/* Scroll target */}

            <div ref={messagesEndRef} />

          </div>

          {/* =========================
              SUGGESTED QUESTIONS
          ========================= */}

          {messages.length === 0 && !loading && (
            <div className="chat-suggestions">

              <div className="questions-heading">

                <Sparkles size={17} />

                <span>
                  Try asking
                </span>

              </div>

              <div className="question-buttons">

                {suggestedQuestions.map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() =>
                        handleQuestion(item)
                      }
                      disabled={loading}
                    >
                      {item}
                    </button>
                  )
                )}

              </div>

            </div>
          )}

        </section>

        {/* =========================
            CHAT INPUT
        ========================= */}

        <section className="ai-input-card">

          <input
            type="text"
            placeholder={`Ask about ${playerA.name} and ${playerB.name}...`}
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={(e) => {

              if (
                e.key === "Enter" &&
                question.trim() &&
                !loading
              ) {
                handleQuestion(question);
              }

            }}
            disabled={loading}
          />

          <button
            onClick={() => {

              if (
                question.trim() &&
                !loading
              ) {
                handleQuestion(question);
              }

            }}
            disabled={
              loading ||
              !question.trim()
            }
          >
            <Send size={18} />

            {loading
              ? "Analyzing..."
              : "Send"}
          </button>

        </section>

        {/* =========================
            DISCLAIMER
        ========================= */}

        <p className="chat-disclaimer">
          Cricktics AI analyzes the statistics
          provided for this matchup.
        </p>

      </main>

    </div>
  );
}

export default AIAnalyst;