// Day archiving: a day is "completed" once the calendar has rolled past it (after the
// midnight that ends it). Completed days move to the Archive unless the user has
// explicitly un-archived them (kept active). Tracked by day number in state.unarchived.
const MON = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };

// Local-time midnight at the END of the given itinerary day (i.e. start of the next day).
export function dayEndMs(d) {
  return new Date(2026, MON[d.dm] || 0, (+d.dd) + 1, 0, 0, 0, 0).getTime();
}

// True once "today" is past the day (after midnight following it).
export function isDayCompleted(d, now) {
  return (now || Date.now()) >= dayEndMs(d);
}

// A day shows in the Archive when it's completed AND not manually un-archived.
export function isDayArchived(d, unarchived, now) {
  return isDayCompleted(d, now) && !(unarchived && unarchived[d.d]);
}
