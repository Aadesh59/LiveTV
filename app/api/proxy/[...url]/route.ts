import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ url: string[] }> }
) {
  try {
    const { url: urlParts } = await params;
    if (!urlParts || urlParts.length === 0) {
      return new NextResponse('Missing URL parameter', { status: 400 });
    }

    // Reconstruct the original URL
    const searchParams = request.nextUrl.searchParams.toString();
    const query = searchParams ? `?${searchParams}` : '';

    let targetUrl = '';
    if (urlParts[0] === 'http' || urlParts[0] === 'https') {
      // Full scheme was preserved in the proxy path (e.g. /api/proxy/http/host/path)
      targetUrl = `${urlParts[0]}://${urlParts.slice(1).join('/')}${query}`;
    } else {
      // The VideoPlayer strips "http://" before calling this proxy,
      // so the original scheme is always http. Default to http.
      targetUrl = `http://${urlParts.join('/')}${query}`;
    }

    // Fetch the remote resource with headers that mimic a media player
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LiveTV/1.0)',
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Upstream error: ${response.status}`, {
        status: response.status,
      });
    }

    // Return the response with CORS headers
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

    const contentType = response.headers.get('Content-Type') || '';
    if (contentType) {
      headers.set('Content-Type', contentType);
    }

    // Check if this is an HLS manifest that may need URL rewriting
    const isM3U8 =
      targetUrl.endsWith('.m3u8') ||
      contentType.includes('mpegurl') ||
      contentType.includes('x-mpegURL');

    if (isM3U8) {
      const text = await response.text();
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);

      // Rewrite relative URLs in the manifest to go through the proxy
      const rewritten = text.replace(/^(?!#)(?!https?:\/\/)(.+)$/gm, (match) => {
        const trimmed = match.trim();
        if (!trimmed) return match;

        // Build the absolute URL for this segment/sub-playlist
        let absoluteUrl: string;
        if (trimmed.startsWith('/')) {
          // Root-relative: use origin
          const urlObj = new URL(targetUrl);
          absoluteUrl = `${urlObj.protocol}//${urlObj.host}${trimmed}`;
        } else {
          // Path-relative: use base directory of the manifest
          absoluteUrl = baseUrl + trimmed;
        }

        // Strip the scheme and route through our proxy
        const withoutScheme = absoluteUrl.replace(/^https?:\/\//, '');
        return `/api/proxy/${withoutScheme}`;
      });

      // HLS manifests must not be cached (they change every few seconds)
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

      return new NextResponse(rewritten, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    // Cache .ts video segments briefly — they are immutable once written
    if (targetUrl.endsWith('.ts')) {
      headers.set('Cache-Control', 'public, max-age=10, stale-while-revalidate=5');
    }

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Proxy error', { status: 500 });
  }
}

// Use Vercel Edge Runtime: no cold starts, runs globally near users
export const runtime = 'edge';
