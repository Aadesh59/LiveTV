export type Channel = {
  id: string;
  name: string;
  logo: string;        // image URL
  url: string;         // HLS m3u8 link
  category: string;
  isHD?: boolean;
  language?: string;
};
