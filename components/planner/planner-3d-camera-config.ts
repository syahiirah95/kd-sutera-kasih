import { type PlannerThreeDCameraMode } from "@/components/planner/planner-types";

export const PLANNER_3D_CAMERA_CONFIG: Record<
  PlannerThreeDCameraMode,
  {
    fov: number;
    position: [number, number, number];
  }
> = {
  perspective: {
    fov: 45,
    position: [40, 45, 55],
  },
  top: {
    fov: 42,
    position: [0, 92, 0.01],
  },
};
