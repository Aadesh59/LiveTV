import { Channel } from "@/types";

// This file is where the user will add their own HLS links.
// For now, these are some mock channels with a reliable test stream.
export const channels: Channel[] = [
  {
    id: "ch-2",
    name: "Kantipur max",
    logo: "https://placehold.co/400x400/2563eb/ffffff?text=SC",
    url: "https://ktvhdsg.ekantipur.com:8443/ktvmax_nepal_d827kky3dftm/free/playlist.m3u8",
    category: "Sports",
    isHD: true,
  },
];
