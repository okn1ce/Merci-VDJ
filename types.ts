
import React from 'react';

export interface MousePosition {
  x: number;
  y: number;
}

export interface ParallaxProps {
  children: React.ReactNode;
  factor?: number;
  className?: string;
}

export type ChangeType = 'new' | 'fix' | 'improved' | 'system' | 'announcement';

export interface PatchChange {
  type: ChangeType;
  text: string;
}

export interface PatchNote {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: PatchChange[];
}

// Added missing Jellyfin authentication interface
export interface JellyfinAuth {
  serverUrl: string;
  accessToken: string;
  userId: string;
  username: string;
}

// Added missing interfaces for user statistics
export interface TopShow {
  id: string;
  name: string;
  playedCount: number;
  totalCount: number;
  percentage: number;
}

export interface UserStats {
  seriesStarted: number;
  seriesWatched: number;
  episodesWatched: number;
  moviesWatched: number;
  totalWatchTimeMinutes: number;
  topShows: TopShow[];
}
