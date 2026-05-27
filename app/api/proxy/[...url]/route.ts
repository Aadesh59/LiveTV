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
      targetUrl = `${urlParts[0]}://${urlParts.slice(1).join('/')}${query}`;
    } else {
      const isIP = /^[0-9.]+$/.test(urlParts[0].split(':')[0]);
      const scheme = isIP ? 'http' : 'https';
      targetUrl = `${scheme}://${urlParts.join('/')}${query}`;
    }

    // Fetch the remote resource
    const response = await fetch(targetUrl);
    
    // Return the response with CORS headers
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    
    const contentType = response.headers.get('Content-Type');
    if (contentType) {
      headers.set('Content-Type', contentType);
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
