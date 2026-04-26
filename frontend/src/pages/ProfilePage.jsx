import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile, getPlayerRuns } from "../logic/profileLogic";
import Chart from "chart.js/auto";
import "../css/global.css";

export default function ProfilePage() {
  const { ign } = useParams();
  const navigate = useNavigate();

  const [searchIgn, setSearchIgn] = useState(ign);
  const [profileInfo, setProfileInfo] = useState([]);
  const [runs, setRuns] = useState([]);
  const [sortedRuns, setSortedRuns] = useState([]);
  const [sortMode, setSortMode] = useState({ column: "date", direction: "desc" });
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [notEnoughData, setNotEnoughData] = useState(false);

  // Chart refs
  const winLossRef = useRef(null);
  const completionRef = useRef(null);

  // Fetch profile info
  useEffect(() => {
    const fetchData = async () => {
      const result = await getProfile(ign);
      if (result.length === 1) {
        setError(result[0]);
        return;
      }
      setProfileInfo(result);
    };
    fetchData();
  }, [ign]);

  // Fetch runs from API
  useEffect(() => {
    const fetchRuns = async () => {
      const data = await getPlayerRuns(ign, pageSize);
      setRuns(data);
    };
    fetchRuns();
  }, [ign, pageSize]);

  // Convert "m:ss" → seconds
  const toSeconds = (t) => {
    const [m, s] = t.split(":").map(Number);
    return m * 60 + s;
  };

  // Sorting logic
  const sortRuns = (column, direction) => {
    const sorted = [...runs];

    sorted.sort((a, b) => {
      let valA, valB;

      switch (column) {
        case "time":
          valA = toSeconds(a.time);
          valB = toSeconds(b.time);
          break;

        case "result":
          const aWin = a.result.includes("Win") ? 1 : 0;
          const bWin = b.result.includes("Win") ? 1 : 0;
          if (aWin !== bWin) return direction === "asc" ? aWin - bWin : bWin - aWin;

          valA = toSeconds(a.time);
          valB = toSeconds(b.time);
          break;

        case "opponent":
          valA = a.opponent.toLowerCase();
          valB = b.opponent.toLowerCase();
          return direction === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);

        default:
          return 0;
      }

      return direction === "asc" ? valA - valB : valB - valA;
    });

    return sorted;
  };

  // Re-sort whenever runs or sort mode changes
  useEffect(() => {
    setSortedRuns(sortRuns(sortMode.column, sortMode.direction));
    setPage(1);
  }, [runs, sortMode.column, sortMode.direction]);

  // Pagination
  const totalPages = Math.ceil(sortedRuns.length / pageSize);
  const paginatedRuns = sortedRuns.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    const filteredTimes = runs.map(r => {
      const isWin = r.result.includes("Win");
      const isForfeit = r.time.includes("Forfeit");
      return isWin && !isForfeit ? toSeconds(r.time) : null;
    });

    const validPoints = filteredTimes.filter(v => v !== null).length;
    setNotEnoughData(validPoints < 5);
  }, [runs]);

  // Charts
  useEffect(() => {
    const id = setTimeout(() => {
      if (!winLossRef.current) return;

      if (winLossRef.current._chartInstance) {
        winLossRef.current._chartInstance.destroy();
      }

      const wins = runs.filter(r => r.result.includes("Win")).length;
      const losses = runs.filter(r => r.result.includes("Loss")).length;
      const draws = runs.filter(r => r.result.includes("Draw")).length;

      const winLossChart = new Chart(winLossRef.current, {
        type: "pie",
        data: {
          labels: ["Wins", "Losses", "Draws"],
          datasets: [{
            data: [wins, losses, draws],
            backgroundColor: ["#80FF00", "#FF4444", "#2196F3"]
          }]
        }
      });

      winLossRef.current._chartInstance = winLossChart;

      if (completionRef.current?._chartInstance) {
        completionRef.current._chartInstance.destroy();
      }

      if (!notEnoughData && completionRef.current) {
        const filteredTimes = runs.map(r => {
          const isWin = r.result.includes("Win");
          const isForfeit = r.time.includes("Forfeit");
          return isWin && !isForfeit ? toSeconds(r.time) : null;
        });

        const maxTime = Math.max(...filteredTimes.filter(v => v !== null));
        const yMax = maxTime + 180;
        const reversedTimes = [...filteredTimes].reverse();

        const completionChart = new Chart(completionRef.current, {
          type: "line",
          data: {
            labels: runs.map((_, i) => `Run ${i + 1}`),
            datasets: [{
              label: "Completion Time (seconds)",
              data: reversedTimes,
              borderColor: "#00C3FF",
              backgroundColor: "rgba(0,195,255,0.2)",
              tension: 0.3,
              spanGaps: true
            }]
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                min: 0,
                max: yMax
              }
            }
          }
        });

        completionRef.current._chartInstance = completionChart;
      }
    }, 0);

    return () => clearTimeout(id);
  }, [runs, notEnoughData]);

  // Clickable table headers
  const handleSort = (column) => {
    setSortMode((prev) => {
      if (prev.column === column) {
        return { column, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { column, direction: "asc" };
    });
  };

  // Loading or error
  if (error) {
    return (
      <main className="profile-layout">
        <section className="mc-panel error-panel">
          <h2>Error Loading Profile...</h2>
          <p>{error}</p>

          <input
            className="mc-input"
            type="text"
            placeholder="Search IGN"
            value={searchIgn}
            onChange={(e) => setSearchIgn(e.target.value)}
          />

          <button className="mc-button" onClick={() => navigate(`/profile/${searchIgn}`)}>
            Search
          </button>
        </section>
      </main>
    );
  }

  if (profileInfo.length === 0) return <p>Loading...</p>;

  return (
    <main className="profile-layout">
      <h2>{ign}</h2>

      <section className="profile-nav">
        <select onChange={(e) => {
          const sectionId = e.target.value;
          if (sectionId) {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
          }
        }}>
          <option value="">Jump to section...</option>
          <option value="rank-section">Rank</option>
          <option value="elo-section">Elo</option>
          <option value="avg-section">Average Completion Time</option>
          <option value="streak-section">Win Streak</option>
          <option value="wl-section">Win-Loss Record</option>
          <option value="pb-section">Personal Best</option>
          <option value="trends-section">Recent Trends</option>
          <option value="runs-section">Runs</option>
        </select>
      </section>

      <section id="rank-section" className="mc-panel">
        <h3>Rank</h3>
        <p>{profileInfo[0]}</p>
      </section>

      <section id="elo-section" className="mc-panel">
        <h3>Elo</h3>
        <p>{profileInfo[1]}</p>
      </section>

      <section id="avg-section" className="mc-panel">
        <h3>Average Completion Time</h3>
        <p>{profileInfo[2]}</p>
      </section>

      <section id="streak-section" className="mc-panel">
        <h3>Win Streak</h3>
        <p>{profileInfo[3]}</p>
      </section>

      <section id="wl-section" className="mc-panel">
        <h3>Win-Loss Record</h3>
        <p>{profileInfo[4]}</p>
      </section>

      <section id="pb-section" className="mc-panel">
        <h3>Personal Best</h3>
        <p>{profileInfo[5]}</p>
      </section>

      <section id="trends-section" className="mc-panel">
        <h3>Recent Trends</h3>
          <div className="charts-row">
            <div className="chart-box">
              <canvas ref={winLossRef}></canvas>
            </div>
            <div className="chart-box">
              {notEnoughData ? (
                <div className="no-data">Not enough data</div>
              ) : (
                <canvas ref={completionRef}></canvas>
              )}
            </div>
          </div>
      </section>

      <section id="runs-section" className="mc-panel">
        <h3>Runs</h3>

        <div className="run-page-size">
          <label className="entries-label">Show</label>

          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>

          <label className="entries-label">entries</label>
        </div>

        <p>Total Runs: {sortedRuns.length}</p>

        <table className="run-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("result")}>Result</th>
              <th onClick={() => handleSort("time")}>Time</th>
              <th onClick={() => handleSort("opponent")}>Opponent</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRuns.map((run, i) => (
              <tr key={i}>
                <td
                  style={{
                    color:
                      run.result === "Win"
                        ? "#4CAF50"
                        : run.result === "Loss"
                        ? "#FF4444"
                        : "#2196F3"
                  }}
                >
                  {run.result}
                </td>
                <td>{run.time}</td>
                <td>{run.opponent}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page}/{totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </section>
    </main>
  );
}
