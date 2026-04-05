console.log("Compare page loaded");

/*
Temporary data, for testing purposes
*/

const mockComparison = [
    { split: "Overworld", a: 120, b: 140, diff: "+20" },
    { split: "Nether", a: 95, b: 110, diff: "+15" },
    { split: "Stronghold", a: 80, b: 75, diff: "-5" },
    { split: "End", a: 60, b: 70, diff: "+10" }
];

window.startCompare = function () {
    const a = document.getElementById("p1").value;
    const b = document.getElementById("p2").value;

    if (!a || !b) {
        alert("Please enter both usernames.");
        return;
    }

    renderComparison(a, b);
};

function renderComparison(a, b) {
    const root = document.getElementById("compare-root");
    
    root.innerHTML = `
        <h3>Comparing ${a} vs ${b}</h3>

        <table class="comparison-table">
            <tr>
                <th>Split</th>
                <th>${a}</th>
                <th>${b}</th>
                <th>Difference</th>
            </tr>

            ${mockComparison.map(r => `
                <tr>
                    <td>${r.split}</td>
                    <td>${r.a}</td>
                    <td>${r.b}</td>
                    <td>${r.diff}</td>
                </tr>
            `).join("")}
        </table>
    `;
}