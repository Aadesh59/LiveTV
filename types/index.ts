export type Channel = {
  id: string;
  name: string;
  logo: string;        // image URL
  url: string;         // HLS m3u8 or DASH mpd link
  category: string;
  isHD?: boolean;
  language?: string;
};
