console.log("Profile page loaded");

/*
Temporary data, for testing purposes
*/
const sampleProfile = {
    ign: "StupidSteve",
    rank: 4821,
    elo: 1524,
    averageCompletionTime: "6:42",
    winStreak: 4,
    wlRecord: {
        wins: 58,
        losses: 41
    },

    personalBest: {
        time: "5:21",
        date: "2026-03-12"
    },

    recentTrends: {
        winLossTrend: [1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
        completionTimes: [7.10, 6.85, 6.60, 6.55, 6.40, 6.30, 6.42]
    },

    runs: [
        {
            time: "6:32",
            result: "Win",
            opponent: "NetherNight",
            date: "2026-04-01"
        },
        {
            time: "7:05",
            result: "Loss",
            opponent: "BlazeBlob",
            date: "2026-03-30"
        },
        {
            time: "6:48",
            result: "Win",
            opponent: "PortalPro",
            date: "2026-03-29"
        },
        {
            time: "5:21",
            result: "Win (PB)",
            opponent: "StrongholdSam",
            date: "2026-03-12"
        },
        {
            time: "7:40",
            result: "Loss",
            opponent: "EnderEli",
            date: "2026-03-10"
        }
    ]
};

// Render functions for each section
function renderIGN() {
    document.getElementById("ign-content").innerHTML = `
        <p>${sampleProfile.ign}</p>
    `;
}

function renderRank() {
    document.getElementById("rank-content").innerHTML = `
        <p>${sampleProfile.rank}</p>
    `;
}

function renderElo() {
    document.getElementById("elo-content").innerHTML = `
        <p>${sampleProfile.elo}</p>
    `;
}

function renderAverageTime() {
    document.getElementById("avg-time-content").innerHTML = `
        <p>${sampleProfile.averageCompletionTime}</p>
    `;
}

function renderWinStreak() {
    document.getElementById("win-streak-content").innerHTML = `
        <p>${sampleProfile.winStreak}</p>
    `;
}

function renderWLRecord() {
    document.getElementById("wl-record-content").innerHTML = `
        <p>${sampleProfile.wlRecord.wins} - ${sampleProfile.wlRecord.losses}</p>
    `;
}

function renderPB() {
    document.getElementById("pb-content").innerHTML = `
        <p>Time: ${sampleProfile.personalBest.time}</p>
        <p>Date: ${sampleProfile.personalBest.date}</p>
    `;
}

// Run History and Sorting
function toSeconds(timeStr) {
    const [m, s] = timeStr.split(":").map(Number);
    return m * 60 + s;
}

function sortRuns(runs, mode) {
    const sorted = [...runs];

    switch (mode) {
        case "date-desc":
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case "date-asc":
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case "time-asc":
            sorted.sort((a, b) => toSeconds(a.time) - toSeconds(b.time));
            break;
        case "time-desc":
            sorted.sort((a, b) => toSeconds(b.time) - toSeconds(a.time));
            break;
        case "result-win":
            sorted.sort((a, b) => (a.result.includes("Win") ? -1 : 1));
            break;
        case "result-loss":
            sorted.sort((a, b) => (a.result.includes("Loss") ? -1 : 1));
            break;
        case "opponent-asc":
            sorted.sort((a, b) => a.opponent.localeCompare(b.opponent));
            break;
        case "opponent-desc":
            sorted.sort((a, b) => b.opponent.localeCompare(a.opponent));
            break;
    }
    return sorted;
}

function renderRunHistory(runs) {
    const tbody = document.getElementById("run-history-body");
    tbody.innerHTML = "";

    runs.forEach(run => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${run.result}</td>
            <td>${run.time}</td>
            <td>
                <a href="profile.html?user=${encodeURIComponent(run.opponent)}" class="opponent-link">
                    ${run.opponent}
                </a>
            </td>
            <td>${run.date}</td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById("total-runs").textContent = runs.length;
}

// Recentr Trends Charts
function renderTrends() {
    const ctx1 = document.getElementById("winLossTrendChart");
    const ctx2 = document.getElementById("completionTrendChart");

    const wins = sampleProfile.recentTrends.winLossTrend.filter(v => v === 1).length;
    const losses = sampleProfile.recentTrends.winLossTrend.filter(v => v === 0).length;

    new Chart(ctx1, {
        type: "pie",
        data: {
            labels: ["Wins", "Losses"],
            datasets: [{
                data: [wins, losses],
                backgroundColor: ["#80FF00", "#FF4444"],
                borderColor: ["#4CAF00", "#CC0000"],
                borderWidth: 2
            }]
        }
    });

    new Chart(ctx2, {
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
}

// Initialize page
function initProfile() {
    renderIGN();
    renderRank();
    renderElo();
    renderAverageTime();
    renderWinStreak();
    renderWLRecord();
    renderPB();

    // default sort: newest -> oldest
    const defaultSorted = sortRuns(sampleProfile.runs, "date-desc");
    renderRunHistory(defaultSorted)

    // sorting dropdown
    document.getElementById("run-sort").addEventListener("change", (e) => {
        const sorted = sortRuns(sampleProfile.runs, e.target.value);
        renderRunHistory(sorted);
    });

    renderTrends();
}

initProfile();