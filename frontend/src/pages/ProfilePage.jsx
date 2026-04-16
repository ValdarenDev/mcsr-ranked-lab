import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile } from "../logic/profileLogic";
import Chart from "chart.js/auto";
import "../css/global.css";

export default function ProfilePage() {
  const { ign } = useParams();
  console.log("IGN from URL:", ign);

  const navigate = useNavigate();
  const [searchIgn, setSearchIgn] = useState(ign);
  const [runs, setRuns] = useState([]);
  const [sortMode, setSortMode] = useState({ column: "date", direction: "desc" });
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [profileInfo, setProfileInfo] = useState([]);
  const [error, setError] = useState(null);

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

  // Chart refs
  const winLossRef = useRef(null);
  const completionRef = useRef(null);

  const sampleProfile = {
    ign: ign || "Unknown Player",
    rank: profileInfo[0],
    elo: profileInfo[1],
    averageCompletionTime: profileInfo[2],
    winStreak: profileInfo[3],
    wlRecord: profileInfo[4],
    personalBest: profileInfo[5],
    recentTrends: {
      winLossTrend: [1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
      completionTimes: [7.10, 6.85, 6.60, 6.55, 6.40, 6.30, 6.42]
    },
    runs: [
      { time: "6:32", result: "Win", opponent: "NetherNight", date: "2026-04-01" },
      { time: "7:05", result: "Loss", opponent: "BlazeBlob", date: "2026-03-30" },
      { time: "6:48", result: "Win", opponent: "PortalPro", date: "2026-03-29" },
      { time: "5:21", result: "Win (PB)", opponent: "StrongholdSam", date: "2026-03-12" },
      { time: "7:40", result: "Loss", opponent: "EnderEli", date: "2026-03-10" },
    ]
  };

  // Convert time to seconds
  const toSeconds = (t) => {
    const [m, s] = t.split(":").map(Number);
    return m * 60 + s;
  };

  // Sorting logic
  const sortRuns = (column, direction) => {
    const sorted = [...sampleProfile.runs];
    
    sorted.sort((a, b) => {
      let valA, valB;

      switch (column) {
        case "date":
          valA = new Date(a.date);
          valB = new Date(b.date);
          break;
        
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

  // Initialize sorted runs
  useEffect(() => {
    setRuns(sortRuns(sortMode.column, sortMode.direction));
    setPage(1);
  }, [sortMode]);

  // Pagination
  const totalPages = Math.ceil(runs.length / pageSize);
  const paginatedRuns = runs.slice((page - 1) * pageSize, page * pageSize);

  // Render charts
  useEffect(() => {
    if (!winLossRef.current || !completionRef.current) return;
    
    if(winLossRef.current._chartInstance) {
      winLossRef.current._chartInstance.destroy();
    }
    if(completionRef.current._chartInstance) {
      completionRef.current._chartInstance.destroy();
    }

    const wins = sampleProfile.recentTrends.winLossTrend.filter(v => v === 1).length;
    const losses = sampleProfile.recentTrends.winLossTrend.filter(v => v === 0).length;

    const winLossChart = new Chart(winLossRef.current, {
      type: "pie",
      data: {
        labels: ["Wins", "Losses"],
        datasets: [{
          data: [wins, losses],
          backgroundColor: ["#80FF00", "#FF4444"]
        }]
      }
    }, [ign]);

    const completionChart = new Chart(completionRef.current, {
      type: "line",
      data: {
        labels: sampleProfile.recentTrends.completionTimes.map((_, i) => `Run ${i+1}`),
        datasets: [{
          label: "Completion Time (minutes)",
          data: sampleProfile.recentTrends.completionTimes,
          borderColor: "#00C3FF",
          backgroundColor: "rgba(0,195,255,0.2)",
          tension: 0.3
        }]
      }
    });

    winLossRef.current._chartInstance = winLossChart;
    completionRef.current._chartInstance = completionChart;

    return () => {
      winLossChart.destroy();
      completionChart.destroy();
    };
  }, [ign]);

  // Clickable table headers
  const handleSort = (column) => {
    setSortMode((prev) => {
      if (prev.column === column) {
        return {
          column,
          direction: prev.direction === "asc" ? "desc" : "asc"
        };
      }
      return { column, direction: "asc" };
    });
  }

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

          ></input>

          <button className="mc-button" onClick={() => navigate(`/profile/${searchIgn}`)}>
            Search
          </button>
        </section>
      </main>
    );
  }

  if (profileInfo.length === 0) {
    return <p>Loading...</p>;
  } else {
      return (
        <main className="profile-layout">
          <h2>{sampleProfile.ign}</h2>

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
              <option value ="streak-section">Win Streak</option>
              <option value="wl-section">Win-Loss Record</option>
              <option value="pb-section">Personal Best</option>
              <option value="trends-section">Recent Trends</option>
              <option value="runs-section">Runs</option>
            </select>
          </section>

          <section id="rank-section" className="mc-panel">
            <h3>Rank</h3>
            <p>{sampleProfile.rank}</p>
          </section>

          <section id="elo-section" className="mc-panel">
            <h3>Elo</h3>
            <p>{sampleProfile.elo}</p>
          </section>

          <section id="avg-section" className="mc-panel">
            <h3>Average Completion Time</h3>
            <p>{sampleProfile.averageCompletionTime}</p>
          </section>

          <section id="streak-section" className="mc-panel">
            <h3>Win Streak</h3>
            <p>{sampleProfile.winStreak}</p>
          </section>

          <section id="wl-section" className="mc-panel">
            <h3>Win-Loss Record</h3>
            <p>{sampleProfile.wlRecord}</p>
          </section>

          <section id="pb-section" className="mc-panel">
            <h3>Personal Best</h3>
            <p>{sampleProfile.personalBest}</p>
          </section>

          <section id="trends-section" className="mc-panel">
            <h3>Recent Trends</h3>
            <div className="charts-row">
              <canvas ref={winLossRef}></canvas>
              <canvas ref={completionRef}></canvas>
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

            <p>Total Runs: {runs.length}</p>

            <table className="run-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("result")}>Result</th>
                  <th onClick={() => handleSort("time")}>Time</th>
                  <th onClick={() => handleSort("opponent")}>Opponent</th>
                  <th onClick={() => handleSort("date")}>Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRuns.map((run, i) => (
                  <tr key={i}>
                    <td>{run.result}</td>
                    <td>{run.time}</td>
                    <td>{run.opponent}</td>
                    <td>{run.date}</td>
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
}