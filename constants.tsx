
import { PatchNote } from './types';

export const PATCH_NOTES: PatchNote[] = [
  {
    version: "v2.1.0",
    date: "March 2026",
    title: "The Spring Awakening",
    description: "A major overhaul of the discovery engine and server infrastructure to handle our growing library.",
    changes: [
      { type: 'new', text: "Introduced 'Vidio Collections' - curated lists of thematic cinema." },
      { type: 'improved', text: "Enhanced 4K streaming stability for remote users." },
      { type: 'system', text: "Migrated database to NVMe storage for 3x faster metadata loading." },
      { type: 'fix', text: "Resolved the 'Infinite Loading' bug on older Smart TV browsers." }
    ]
  },
  {
    version: "v2.0.4",
    date: "February 14, 2026",
    title: "Valentine's Maintenance",
    description: "Minor tweaks to ensure everyone can enjoy their favorite romance movies without a hitch.",
    changes: [
      { type: 'improved', text: "Updated metadata for the 'Romantic Classics' category." },
      { type: 'fix', text: "Fixed subtitle sync issues on several French-language titles." }
    ]
  },
  {
    version: "v2.0.0",
    date: "January 2026",
    title: "Year Two: The New Chapter",
    description: "Celebrating our first anniversary with a completely rewritten frontend and brand identity.",
    changes: [
      { type: 'new', text: "New aesthetic landing page with interactive parallax effects." },
      { type: 'new', text: "Dedicated anime section with automated sub/dub sorting." },
      { type: 'improved', text: "Complete re-encoding of the top 50 most watched movies to AV1." },
      { type: 'announcement', text: "Officially supporting 20+ active simultaneous users." }
    ]
  },
  {
    version: "v1.8.2",
    date: "December 2025",
    title: "Holiday Prep",
    description: "Stabilizing the server for the holiday rush.",
    changes: [
      { type: 'system', text: "Added 16TB of additional storage capacity." },
      { type: 'fix', text: "Corrected poster art for the Marvel Cinematic Universe collection." }
    ]
  }
];
