export interface Roadmap {
  id: string;
  title: string;
  description?: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  settings: RoadmapSettings;
  lanes: Lane[]; // Tracks
  resources: Resource[]; // Global resources available
}

export interface RoadmapSettings {
  sprintPrefix: string;
  sprintStartNumber: number;
  sprintDurationWeeks: number;
  sprintStartDate: string; // ISO date
  numberOfSprints: number;
  showQuarterMarkers: boolean;
  showResourceTotals: boolean;
  theme: 'dark' | 'light';
  categories: LaneCategory[];
}

export interface LaneCategory {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  order: number;
}

export interface Lane {
  id: string;
  name: string;
  objective?: string;
  category?: string;
  description?: string;
  categoryId?: string; // Link to LaneCategory
  order: number;
  isCollapsed?: boolean;
  items: TimelineItem[];
}

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  status?: string;
  laneId?: string;
  startSprintId?: string;
  endSprintId?: string;
  startDate?: string;
  endDate?: string;
  type?: 'smart-img' | 'ai-related' | 'one-off' | 'ongoing' | 'revenue';
  resourceIds: string[];
  resources?: any[];
  dependencyIds: string[];
  operationalCost?: number;
  isHighValue?: boolean;
  isRevenueMaker?: boolean;
  shortName?: string;
  resourceAllocation?: { [sprintNumber: number]: { [roleId: string]: number; }; };
}

export type ResourceRole = 'FE' | 'BE' | 'ML' | 'UX' | 'DevOps' | 'QA' | 'Product' | 'Design';

export interface Resource {
  id: string;
  name: string;
  role: ResourceRole;
  avatar?: string;
  hourlyRate: number;
}

export interface Sprint {
  number: number;
  start: string;
  end: string;
  quarter?: string;
}
