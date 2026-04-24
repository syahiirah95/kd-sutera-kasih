export const PLANNER_CANVAS_HEIGHT = 540;
export const PLANNER_ROOM_INSET_PERCENT = 6;
export const PLANNER_ROOM_USABLE_PERCENT = 100 - PLANNER_ROOM_INSET_PERCENT * 2;
export const PLANNER_SNAP_STEP = 2;

export const HALL_WIDTH = 80;
export const HALL_DEPTH = 50;
export const WALL_HEIGHT = 12;

export function clampToPlannerBounds(value: number, min = PLANNER_ROOM_INSET_PERCENT, max = 100 - PLANNER_ROOM_INSET_PERCENT) {
  return Math.max(min, Math.min(max, value));
}

export function snapPlannerValue(value: number, step = PLANNER_SNAP_STEP) {
  const snappedValue = Math.round(value / step) * step;
  return clampToPlannerBounds(snappedValue);
}

export function mapPlannerXToWorld(x: number) {
  const normalizedX = (x - PLANNER_ROOM_INSET_PERCENT) / PLANNER_ROOM_USABLE_PERCENT;
  return (normalizedX - 0.5) * HALL_WIDTH;
}

export function mapPlannerYToWorld(y: number) {
  const normalizedY = (y - PLANNER_ROOM_INSET_PERCENT) / PLANNER_ROOM_USABLE_PERCENT;
  return (normalizedY - 0.5) * HALL_DEPTH;
}

export function mapWorldXToPlanner(x: number) {
  const normalizedX = x / HALL_WIDTH + 0.5;
  return clampToPlannerBounds(normalizedX * PLANNER_ROOM_USABLE_PERCENT + PLANNER_ROOM_INSET_PERCENT);
}

export function mapWorldZToPlanner(z: number) {
  const normalizedZ = z / HALL_DEPTH + 0.5;
  return clampToPlannerBounds(normalizedZ * PLANNER_ROOM_USABLE_PERCENT + PLANNER_ROOM_INSET_PERCENT);
}
