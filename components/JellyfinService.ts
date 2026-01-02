
import { JellyfinAuth, UserStats } from '../types';

export class JellyfinService {
  private auth: JellyfinAuth;

  constructor(auth: JellyfinAuth) {
    this.auth = auth;
  }

  private get headers() {
    return {
      'X-Emby-Authorization': `MediaBrowser Client="VidioDiJour", Device="Web", DeviceId="VDJ-${this.auth.userId}", Version="1.0.0", Token="${this.auth.accessToken}"`,
      'Content-Type': 'application/json'
    };
  }

  async fetchStats(): Promise<UserStats> {
    const baseUrl = this.auth.serverUrl.replace(/\/$/, '');
    
    // 1. Fetch all played items
    const playedItemsResponse = await fetch(
      `${baseUrl}/Users/${this.auth.userId}/Items?Recursive=true&IsPlayed=true&IncludeItemTypes=Series,Movie,Episode&Fields=RunTimeTicks,RecursiveItemCount`,
      { headers: this.headers }
    );
    const playedData = await playedItemsResponse.json();
    const items = playedData.Items || [];

    // 2. Fetch all series to calculate completion
    const allSeriesResponse = await fetch(
      `${baseUrl}/Users/${this.auth.userId}/Items?Recursive=true&IncludeItemTypes=Series&Fields=RecursiveItemCount`,
      { headers: this.headers }
    );
    const seriesData = await allSeriesResponse.json();
    const allSeries = seriesData.Items || [];

    const episodes = items.filter((i: any) => i.Type === 'Episode');
    const movies = items.filter((i: any) => i.Type === 'Movie');
    
    // Total watch time (RunTimeTicks is 10 million ticks per second)
    const totalTicks = items.reduce((acc: number, item: any) => acc + (item.RunTimeTicks || 0), 0);
    const totalMinutes = Math.floor(totalTicks / 10000000 / 60);

    // Calculate Series Stats
    const startedSeriesIds = new Set(episodes.map((e: any) => e.SeriesId));
    
    // For Top Shows, we need to count episodes per series
    const showCounts: Record<string, { name: string, count: number, total: number }> = {};
    
    episodes.forEach((ep: any) => {
      if (!showCounts[ep.SeriesId]) {
        const seriesInfo = allSeries.find((s: any) => s.Id === ep.SeriesId);
        showCounts[ep.SeriesId] = { 
          name: ep.SeriesName || 'Unknown Show', 
          count: 0,
          total: seriesInfo?.RecursiveItemCount || 0
        };
      }
      showCounts[ep.SeriesId].count++;
    });

    const topShows = Object.entries(showCounts)
      .map(([id, data]) => ({
        id,
        name: data.name,
        playedCount: data.count,
        totalCount: data.total,
        percentage: data.total > 0 ? Math.round((data.count / data.total) * 100) : 0
      }))
      .sort((a, b) => b.playedCount - a.playedCount)
      .slice(0, 5);

    const seriesWatched = Object.values(showCounts).filter(s => s.count >= s.total && s.total > 0).length;

    return {
      seriesStarted: startedSeriesIds.size,
      seriesWatched,
      episodesWatched: episodes.length,
      moviesWatched: movies.length,
      totalWatchTimeMinutes: totalMinutes,
      topShows
    };
  }
}
