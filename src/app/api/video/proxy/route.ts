export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    try {
        console.log('Proxying video URL:', url);
        const headers = new Headers();
        
        // Forward Range header to support video seeking and chunking
        const range = request.headers.get('Range');
        if (range) {
            console.log('Forwarding Range:', range);
            headers.set('Range', range);
        }

        const response = await fetch(url, { headers });
        console.log('Dropbox response status:', response.status);
        console.log('Dropbox content-type:', response.headers.get('Content-Type'));

        if (!response.ok) {
            console.error('Dropbox error:', response.status, response.statusText);
            return new Response(`Error fetching video: ${response.statusText}`, { status: response.status });
        }

        // Forward essential headers back to the browser
        const responseHeaders = new Headers();
        const contentType = response.headers.get('Content-Type') || 'video/mp4';
        responseHeaders.set('Content-Type', contentType);
        
        const contentLength = response.headers.get('Content-Length');
        if (contentLength) responseHeaders.set('Content-Length', contentLength);
        
        const contentRange = response.headers.get('Content-Range');
        if (contentRange) responseHeaders.set('Content-Range', contentRange);
        
        responseHeaders.set('Accept-Ranges', 'bytes');
        responseHeaders.set('Access-Control-Allow-Origin', '*');

        return new Response(response.body, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Edge Proxy Error:', error);
        return new Response('Failed to stream video', { status: 500 });
    }
}
