import { DAYS, SHADOW_DAYS, ALL, GROUPS, ATTIRE, SHADOW_ATTIRE } from "../data.js";

/* Shadow Tour travelers (only sband/schoir) follow their own itinerary. */
export const isShadowOnly = (g) =>
  g.length > 0 && g.every((x) => x === "sband" || x === "schoir");

export const daySet = (g) => (isShadowOnly(g) ? SHADOW_DAYS : DAYS);
export const attireSet = (g) => (isShadowOnly(g) ? SHADOW_ATTIRE : ATTIRE);

/* Directors see every group's agenda regardless of what they picked. */
export const egroups = (g, isDirector) => (isDirector ? ALL : g);

export const inGroup = (item, g, isDirector) =>
  egroups(g, isDirector).some((x) => (item.groups || []).indexOf(x) > -1);

export const itemGroups = (item, g, isDirector) =>
  GROUPS.filter(
    (x) => egroups(g, isDirector).indexOf(x.id) > -1 && (item.groups || []).indexOf(x.id) > -1
  );

export const myGroups = (g) => GROUPS.filter((x) => g.indexOf(x.id) > -1);
export const myGroupsEff = (g, isDirector) =>
  GROUPS.filter((x) => egroups(g, isDirector).indexOf(x.id) > -1);

/* performers: their performances; shadow: concerts they attend */
export const dayPerfCount = (d, g, isDirector) =>
  (d.items || []).filter(
    (it) => it.type === "performance" && inGroup(it, g, isDirector) && (isShadowOnly(g) || !it.gnote)
  ).length;

export const groupLabel = (g, isDirector) => {
  if (isDirector) return "All groups";
  if (!g.length) return "—";
  if (g.length === GROUPS.length) return "All groups";
  return myGroups(g).map((x) => x.short).join("  +  ");
};
