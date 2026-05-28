const fs = require("fs");
const path = require("path");

const channelsFile = path.join(__dirname, "../data/channels.ts");
const m3uUrl = "https://iptv-org.github.io/iptv/categories/sports.m3u";

const existingChannels = [
  {
    id: "ch-1",
    name: "Kantipur max HD",
    logo: "https://i.imgur.com/EZUyzhG.jpg",
    url: "http://103.154.47.133/media/test11.mpd",
    category: "Sports",
    isHD: true,
  },
  {
    id: "ch-12",
    name: "Kantipur max HD (Alternative)",
    logo: "https://i.imgur.com/EZUyzhG.jpg",
    url: "http://maxotts.maxdigitaltv.com/x-media/C183/master.m3u8",
    category: "Sports",
    isHD: true,
  },
  {
    id: "ch-3",
    name: "Kantipur max-2 HD",
    logo: "https://i.ibb.co/ShK58p6/Kantipur-Max-2-HD.jpg",
    url: "http://103.154.47.137/media/test60.mpd",
    category: "Sports",
    isHD: true,
  },
  {
    id: "ch-4",
    name: "Kantipur max-2 HD (Alternative)",
    logo: "https://i.ibb.co/ShK58p6/Kantipur-Max-2-HD.jpg",
    url: "http://maxotts.maxdigitaltv.com/x-media/C190/master.m3u8",
    category: "Sports",
    isHD: true,
  },
  {
    id: "Sky Sports HD",
    name: "Sky Sports HD",
    logo: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/united-kingdom/sky-sports-main-event-uk.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C18/master.m3u8",
    category: "Sports",
    isHD: true,
  },
  {
    id: "Star Sports 1 HD (1080p)",
    name: "Star Sports 1 HD (1080p)",
    logo: "https://i.imgur.com/E5jjKHI.png",
    url: "http://103.253.18.58:8000/play/a00m",
    category: "Sports",
    isHD: true,
  },
  {
    id: "Star Sports 1 HD (Hindi)",
    name: "Star Sports 1 HD (Hindi)",
    logo: "https://i.imgur.com/E5jjKHI.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C248/master.m3u8",
    category: "Sports",
    isHD: true,
  },
  {
    id: "Star Sports 1 HD Alt",
    name: "Star Sports 1 HD Alt",
    logo: "https://i.imgur.com/E5jjKHI.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C283/master.m3u8",
    category: "Sports",
    isHD: true,
  },
  {
    id: "Star Sports 2 Hindi HD (1080p)",
    name: "Star Sports 2 Hindi HD (1080p)",
    logo: "https://i.imgur.com/kHerF19.png",
    url: "http://103.157.248.140:8000/play/a01m/index.m3u8",
    category: "Sports",
    isHD: true,
  },
  {
    id: "Star Sports 2 HD",
    name: "Star Sports 2 HD",
    logo: "https://xstreamcp-assets-msp.streamready.in/assets/LIVETV/LIVECHANNEL/LIVETV_LIVETVCHANNEL_STAR_SPORTS_2/images/LOGO_HD/image.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C250/master.m3u8",
    category: "Sports",
    isHD: true,
  },
  {
    id: "Sony Sports 1 HD",
    name: "Sony Sports 1 HD",
    logo: "https://i.ibb.co/0RX9ySHP/Sony-Sports-Ten-1-HD.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C65/master.m3u8",
    category: "Sports",
    isHD: true,
  },

  {
    id: "Sony Sports 2 HD",
    name: "Sony Sports 2 HD",
    logo: "https://i.ibb.co/MKnp8VP/Sony-Sports-Ten-2-HD.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C72/master.m3u8",
    category: "Sports",
    isHD: true,
  },

  {
    id: "Sony Sports 3 Hindi HD",
    name: "Sony Sports 3 Hindi HD",
    logo: "https://i.ibb.co/N2YqzP3w/Sony-Ten-3-HD-Hindi.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C73/master.m3u8",
    category: "Sports",
    isHD: true,
  },

  {
    id: "Sony Sports 5 HD",
    name: "Sony Sports 5 HD",
    logo: "https://i.ibb.co/wN25f6X3/Sony-Sports-Ten-5-HD.png",
    url: "http://maxotts.maxdigitaltv.com/x-media/C61/master.m3u8",
    category: "Sports",
    isHD: true,
  },
  {
    id: "ch-3",
    name: "Kantipur max 2 (Low Quality)",
    logo: "https://i.imgur.com/EZUyzhG.jpg",
    url: "https://ktvhdsg.ekantipur.com:8443/ktvmax_nepal_d827kky3dftm/free/playlist.m3u8",
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
    id: "ap1-tv",
    name: "AP1 TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/c6/AP1_TV_LOGO.png",
    url: "http://103.180.240.141:8080/hls/main1/playlist.m3u8",
    category: "News",
    isHD: false,
  },
  {
    id: "news24-tv",
    name: "News 24 (1080p)",
    logo: "https://i.imgur.com/7PgAPMU.png",
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
