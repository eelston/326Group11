// utility functions for report-related use

/**
 * This function calculates the average crowding score from an array of report ids
 * TODO: implement proper/graceful error handling
 * @param {} reportIds 
 * @returns 
 */
export async function calculateAverageCrowdingScore(reportIds) {
    const crowdingScores = await Promise.all(reportIds.map(async id => { // get array of scores
        const GETurl = '/report?' + new URLSearchParams({"id": id}).toString(); // e.g., /report?id=1
        const response = await fetch(GETurl); // GET report by id
        const report = await response.json(); // { body: (report), ok: boolean }
        return report.body.score; // crowding score
    }));

    const average = crowdingScores.length > 0 && crowdingScores.every(x => typeof x === "number") ? crowdingScores.reduce((sum, curr) => sum+curr, 0) / crowdingScores.length : null; // calculate average, or null if no reports
    return average;
}
