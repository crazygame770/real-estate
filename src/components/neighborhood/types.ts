
export interface Neighborhood {
  id: string;
  name: string;
  region_id: string;
  walkability: number;
  safety: number;
  education: number;
  green_spaces: number;
  entertainment: number;
  retail: number;
}

export interface RegionData {
  id: string;
  name: string;
  neighborhoods: Neighborhood[];
}
