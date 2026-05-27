export interface VideoEvent {
  id: string;
  title: string;
  date: string;
  duration: string;
  thumbnail: string;
  videoUrl?: string;
  isLive?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  image_url: string;
  category: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface MissionEventItemFile {
  name: string;
  size: string;
  type: string;
  base64?: string;
}

export interface MissionEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  event_type: string;
  image_url: string;
  time?: string;
  unitId?: string;
  status?: string;
  files?: MissionEventItemFile[];
}

export interface Leader {
  id: string;
  name: string;
  title: string;
  position: string;
  unit: string;
  image_url: string;
  bio: string;
  order: number;
}

export interface NavItem {
  id: string;
  label: string;
  subLabel?: string;
}
