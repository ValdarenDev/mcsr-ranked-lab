import axios from "axios";

export async function getProfile(username) {
    try {
        const res = await axios.get(`https://mcsrranked.com/api/users/${username}`);
        let userData = res.data.data;
        let userStats = userData.statistics.season;
        let userCompletions = userStats.completions.ranked;
        let userWins = userStats.wins.ranked;
        let userLosses = userStats.loses.ranked;

        let userRank = userData.eloRank;
        let userElo = userData.eloRate;
        let userAverage = timeConversion(userStats.completionTime.ranked/userCompletions);
        let userWinstreak = userStats.currentWinStreak.ranked;
        let userWinLoss = `${userWins} - ${userLosses}`;
        let userPb = timeConversion(userStats.bestTime.ranked);

        return [userRank, userElo, userAverage, userWinstreak, userWinLoss, userPb];
    } catch {
        return ["This user has not played ranked before, please try a different IGN!"];
    }
}

function timeConversion(time) {
    let minutes = Math.floor(time / 60000);
    let seconds = Math.floor((time  % 60000) / 1000);
    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    let finalTime = minutes + ":" + formattedSeconds;
    return finalTime;
}