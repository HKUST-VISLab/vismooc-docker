"use strict";
function getWeeks(d) {
    const t = d.getTime();
    // a week is from sunday to saturday.
    return Math.floor((t / 86400000 + 4) / 7);
    // if a week is from monday to sunday.
    // return Math.floor((t / 3600 / 24 / 1000 + 3) / 7);
}
exports.getWeeks = getWeeks;
function parseDate(d) {
    if (!d) {
        return 0;
    }
    else if (typeof d === "number") {
        if (d % 1000 === 0) {
            return d;
        }
        else {
            // second to milliseconds
            return d * 1000;
        }
    }
    else {
        return Date.parse(d);
    }
}
exports.parseDate = parseDate;

//# sourceMappingURL=date.js.map
