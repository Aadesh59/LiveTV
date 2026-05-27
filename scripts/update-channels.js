const fs = require("fs");
const path = require("path");

const channelsFile = path.join(__dirname, "../data/channels.ts");
const m3uUrl = "https://iptv-org.github.io/iptv/categories/sports.m3u";

const existingChannels = [
  {
    id: "ch-1",
    name: "Kantipur max",
    logo: "https://i.imgur.com/EZUyzhG.jpg",
    url: "http://103.154.47.133/media/test11.mpd",
    category: "Sports",
    isHD: true,
  },
  {
    id: "ch-2",
    name: "Kantipur max 2",
    logo: "https://i.imgur.com/EZUyzhG.jpg",
    url: "https://ktvhdsg.ekantipur.com:8443/ktvmax_nepal_d827kky3dftm/free/playlist.m3u8",
    category: "Sports",
    isHD: true,
  },
  {
    id: "ch-3",
    name: "Kantipur max-2",
    logo: "https://i.imgur.com/EZUyzhG.jpg",
    url: "http://103.154.47.137/media/test60.mpd",
    category: "Sports",
    isHD: true,
  },
  {
    id: "kantipur-tv-hd",
    name: "Kantipur TV (1080p)",
    logo: "https://i.imgur.com/HEVo2Gc.png",
    url: "https://ktvhdsg.ekantipur.com:8443/high_quality_85840165/hd/playlist.m3u8",
    category: "News",
    isHD: true,
  },
  {
    id: "capital-tv",
    name: "Capital TV (1080p)",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/CapitalTV_Nepal_logo.png/250px-CapitalTV_Nepal_logo.png",
    url: "https://streaming.tvnepal.com:19360/capitaltv/capitaltv.m3u8",
    category: "News",
    isHD: true,
  },
  {
    id: "divya-darshan-tv",
    name: "Divya Darshan TV (720p)",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Divya_Darshan_TV_logo.png/250px-Divya_Darshan_TV_logo.png",
    url: "http://live.divyadarshantv.com/hls/stream.m3u8",
    category: "Religious",
    isHD: false,
  },
  {
    id: "indigenous-tv",
    name: "Indigenous Television (720p)",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Indigenous_Television_logo.png/250px-Indigenous_Television_logo.png",
    url: "https://np.truestreamz.com/broadcaster/INDIGENOUSmob.stream/playlist.m3u8",
    category: "News",
    isHD: false,
  },
  {
    id: "mithila-nepal-tv",
    name: "Mithila Nepal TV (1080p)",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Mithila_Nepal_Television_logo.png/250px-Mithila_Nepal_Television_logo.png",
    url: "http://150.107.205.212:1935/live/mithila/playlist.m3u8?DVR=",
    category: "Regional",
    isHD: true,
  },
  {
    id: "ap1-tv",
    name: "AP1 TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/c6/AP1_TV_LOGO.png",
    url: "http://103.180.240.141:8080/hls/main1/playlist.m3u8",
    category: "News",
    isHD: false,
  },
  {
    id: "kantipur-tv-sd",
    name: "Kantipur TV (720p)",
    logo: "https://jcss-cdn.ekantipur.com/kantipur-tv/images/ktv-hd.png",
    url: "http://103.213.31.109:90/KantipurPiracyHD/playlist.m3u8",
    category: "News",
    isHD: false,
  },
  {
    id: "news24-tv",
    name: "News 24 (1080p)",
    logo: "https://www.news24nepal.tv/wp-content/themes/news24nepal/img/logo.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C9/master.m3u8",
    category: "News",
    isHD: true,
  },
  {
    id: "ap1-tv-alt",
    name: "AP1 TV (720p)",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/c6/AP1_TV_LOGO.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C22/master.m3u8",
    category: "News",
    isHD: false,
  },
  {
    id: "city-one-tv",
    name: "City One Television (1080p)",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/City_One_Television_Nepal_logo.png/250px-City_One_Television_Nepal_logo.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C209/master.m3u8",
    category: "News",
    isHD: true,
  },
  {
    id: "j-music-tv",
    name: "J Music TV (480p)",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/J_Music_TV_Nepal_logo.png/250px-J_Music_TV_Nepal_logo.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C180/master.m3u8",
    category: "Music",
    isHD: false,
  },
  {
    id: "metv-hd",
    name: "METV HD (1080p)",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/23/METV_HD_Nepal_logo.png/250px-METV_HD_Nepal_logo.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C168/master.m3u8",
    category: "Entertainment",
    isHD: true,
  },
  {
    id: "national-gold-tv",
    name: "National Gold TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/National_Gold_TV_Nepal_logo.png/250px-National_Gold_TV_Nepal_logo.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C170/master.m3u8",
    category: "Entertainment",
    isHD: false,
  },
  {
    id: "bagmati-tv",
    name: "Bagmati TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Bagmati_TV_Nepal_logo.png/250px-Bagmati_TV_Nepal_logo.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C167/master.m3u8",
    category: "News",
    isHD: false,
  },
  {
    id: "dhaulagiri-tv",
    name: "Dhaulagiri Television",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Dhaulagiri_Television_Nepal_logo.png/250px-Dhaulagiri_Television_Nepal_logo.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C117/master.m3u8",
    category: "Regional",
    isHD: false,
  },
];

async function updateChannels() {
  try {
    console.log(
      `Loaded ${existingChannels.length} initial Nepali and local sports channels.`,
    );

    console.log(`Fetching sports M3U from ${m3uUrl}...`);
    const response = await fetch(m3uUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch M3U: ${response.statusText}`);
    }
    const m3uContent = await response.text();

    console.log("Parsing M3U content...");
    const parsedChannels = parseM3U(m3uContent);
    console.log(`Parsed ${parsedChannels.length} channels from M3U.`);

    // Deduplicate against existing channels and itself
    const finalChannels = [...existingChannels];
    const existingUrls = new Set(
      existingChannels.map((c) => c.url.toLowerCase()),
    );
    const existingIds = new Set(
      existingChannels.map((c) => c.id.toLowerCase()),
    );

    let addedCount = 0;
    for (const channel of parsedChannels) {
      // Filter: only keep Sony channels
      if (!channel.name.toLowerCase().includes("sony")) {
        continue;
      }

      if (existingUrls.has(channel.url.toLowerCase())) {
        continue;
      }

      // Ensure unique ID
      let uniqueId = channel.id;
      let suffix = 1;
      while (existingIds.has(uniqueId.toLowerCase())) {
        uniqueId = `${channel.id}-${suffix}`;
        suffix++;
      }

      channel.id = uniqueId;
      existingUrls.add(channel.url.toLowerCase());
      existingIds.add(uniqueId.toLowerCase());

      finalChannels.push(channel);
      addedCount++;
    }

    console.log(
      `Adding ${addedCount} new Sony sports channels. Total channels: ${finalChannels.length}`,
    );

    // Generate the updated TS content
    const updatedContent = `import { Channel } from "@/types";

// This file is where the user will add their own HLS links.
// Automatically updated with Sony sports channels from IPTV-org.
export const channels: Channel[] = ${JSON.stringify(finalChannels, null, 2)};
`;

    fs.writeFileSync(channelsFile, updatedContent, "utf8");
    console.log("Successfully updated data/channels.ts!");
  } catch (error) {
    console.error("Error updating channels:", error);
    process.exit(1);
  }
}

function parseM3U(m3uContent) {
  const lines = m3uContent.split(/\r?\n/);
  const channels = [];
  let currentChannel = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith("#EXTINF:")) {
      currentChannel = {};

      // Extract tvg-logo
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      if (logoMatch) {
        currentChannel.logo = logoMatch[1];
      } else {
        const logoMatchUnquoted = line.match(/tvg-logo=([^ ]*)/);
        if (logoMatchUnquoted) {
          currentChannel.logo = logoMatchUnquoted[1];
        }
      }

      // Extract tvg-id
      const idMatch = line.match(/tvg-id="([^"]*)"/);
      const tvgId = idMatch ? idMatch[1] : "";

      // Extract name (everything after the last comma)
      const commaIndex = line.lastIndexOf(",");
      let name =
        commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : "Unknown";

      currentChannel.name = name;
      currentChannel.category = "Sports";

      // Determine if HD
      currentChannel.isHD =
        name.toLowerCase().includes("1080p") ||
        name.toLowerCase().includes("720p") ||
        name.toLowerCase().includes("hd") ||
        name.toLowerCase().includes("fhd");

      // Generate ID
      const sanitizedName = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      currentChannel.id = `sports-${sanitizedName || Math.random().toString(36).substring(2, 8)}`;

      if (tvgId) {
        const sanitizedId = tvgId
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        if (sanitizedId) {
          currentChannel.id = `sports-${sanitizedId}`;
        }
      }
    } else if (line.startsWith("#")) {
      // Skip tags
      continue;
    } else {
      // It's a URL
      if (currentChannel) {
        currentChannel.url = line;
        if (!currentChannel.logo) {
          currentChannel.logo = `https://placehold.co/400x400/2563eb/ffffff?text=${encodeURIComponent(currentChannel.name)}`;
        }
        channels.push(currentChannel);
        currentChannel = null;
      }
    }
  }

  return channels;
}

updateChannels();
