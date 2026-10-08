import { useState } from "react";
import {
  Activity,
  Sparkles,
  ArrowRight,
  Users,
  Bot,
  CalendarDays,
} from "lucide-react";

import players from "./data/players.js";
import AIAnalyst from "./pages/AIAnalyst.jsx";

function App() {
  const [playerA, setPlayerA] = useState(players[0]);
  const [playerB, setPlayerB] = useState(players[1]);
  const [showAI, setShowAI] = useState(false);

  // Open AI Analyst page
  if (showAI) {
    return <AIAnalyst onBack={() => setShowAI(false)} />;
  }

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          <div className="logo-icon">
            <Activity size={20} />
          </div>

          <span>Cricktics</span>
        </div>

        <div className="nav-right">

          <button
            className="nav-ai-button"
            onClick={() => setShowAI(true)}
          >
            <Bot size={17} />
            AI Analyst
          </button>

          <span className="nav-status">
            <span className="status-dot"></span>
            AI Cricket Analytics
          </span>

          <Sparkles size={18} />

        </div>

      </nav>

      {/* Main Content */}
      <main className="main-content">

        {/* Hero Section */}
        <section className="hero">

          <p className="eyebrow">
            CRICKET INTELLIGENCE
          </p>

          <h1>
            Understand the game.
            <br />
            <span>Beyond the numbers.</span>
          </h1>

          <p className="hero-description">
            Compare players, explore performance statistics,
            and get AI-powered cricket insights.
          </p>

          <button
            className="hero-button"
            onClick={() => setShowAI(true)}
          >
            Try AI Analyst
            <ArrowRight size={18} />
          </button>

        </section>

        {/* Player Comparison Section */}
        <section className="comparison-section">

          <div className="section-heading">

            <div className="section-icon">
              <Users size={20} />
            </div>

            <div>
              <p className="section-label">
                PLAYER ANALYSIS
              </p>

              <h2>
                Compare Players
              </h2>
            </div>

          </div>

          <div className="player-selectors">

            {/* Player A */}
            <div className="player-selector">

              <label>
                PLAYER A
              </label>

              <select
                value={playerA.id}
                onChange={(e) => {
                  const selectedPlayer = players.find(
                    (player) =>
                      player.id === Number(e.target.value)
                  );

                  setPlayerA(selectedPlayer);
                }}
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

              <div className="selected-player">

                <h3>
                  {playerA.name}
                </h3>

                <span>
                  {playerA.role}
                </span>

              </div>

            </div>

            {/* VS */}
            <div className="vs">
              VS
            </div>

            {/* Player B */}
            <div className="player-selector">

              <label>
                PLAYER B
              </label>

              <select
                value={playerB.id}
                onChange={(e) => {
                  const selectedPlayer = players.find(
                    (player) =>
                      player.id === Number(e.target.value)
                  );

                  setPlayerB(selectedPlayer);
                }}
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

              <div className="selected-player">

                <h3>
                  {playerB.name}
                </h3>

                <span>
                  {playerB.role}
                </span>

              </div>

            </div>

          </div>

        </section>
        {/* =========================
    UPCOMING EVENTS
========================= */}

<section className="events-section">

  <div className="section-heading">
    <div className="section-icon">
      <CalendarDays size={20} />
    </div>

    <div>
      <p className="section-label">
        UPCOMING CRICKET
      </p>

      <h2>Upcoming Events</h2>
    </div>
  </div>

  <div className="events-grid">

    {/* Event 1 */}
    <div className="event-card">

      <div className="event-date">
        <span>OCT</span>
        <strong>09</strong>
      </div>

      <div className="event-details">

        <div className="event-top">
          <span className="event-format">
            T20I
          </span>

          <span className="event-time">
            7:00 PM IST
          </span>
        </div>

        <div className="event-teams">
          <strong>India</strong>
          <span>vs</span>
          <strong>West Indies</strong>
        </div>

        <p>JSCA International Stadium, Ranchi</p>

      </div>

    </div>


    {/* Event 2 */}
    <div className="event-card">

      <div className="event-date">
        <span>OCT</span>
        <strong>11</strong>
      </div>

      <div className="event-details">

        <div className="event-top">
          <span className="event-format">
            T20I
          </span>

          <span className="event-time">
            7:00 PM IST
          </span>
        </div>

        <div className="event-teams">
          <strong>India</strong>
          <span>vs</span>
          <strong>West Indies</strong>
        </div>

        <p>Holkar Stadium, Indore</p>

      </div>

    </div>


    {/* Event 3 */}
    <div className="event-card">

      <div className="event-date">
        <span>OCT</span>
        <strong>14</strong>
      </div>

      <div className="event-details">

        <div className="event-top">
          <span className="event-format">
            T20I
          </span>

          <span className="event-time">
            7:00 PM IST
          </span>
        </div>

        <div className="event-teams">
          <strong>India</strong>
          <span>vs</span>
          <strong>West Indies</strong>
        </div>

        <p>Rajiv Gandhi International Stadium, Hyderabad</p>

      </div>

    </div>


    {/* Event 4 */}
    <div className="event-card">

      <div className="event-date">
        <span>OCT</span>
        <strong>17</strong>
      </div>

      <div className="event-details">

        <div className="event-top">
          <span className="event-format">
            T20I
          </span>

          <span className="event-time">
            7:00 PM IST
          </span>
        </div>

        <div className="event-teams">
          <strong>India</strong>
          <span>vs</span>
          <strong>West Indies</strong>
        </div>

        <p>M. Chinnaswamy Stadium, Bengaluru</p>

      </div>

    </div>

  </div>

</section>
      
      </main>

    </div>
  );
}

export default App;