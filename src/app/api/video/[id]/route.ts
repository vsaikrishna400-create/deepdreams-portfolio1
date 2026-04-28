import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
    request: NextRequest,
    context: any
) {
    const params = await context.params;
    const fileId = params.id;

    if (!fileId || fileId.length < 10) {
        return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
    }

    try {
        const range = request.headers.get('range');
        const fetchHeaders: Record<string, string> = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        };
        if (range) fetchHeaders['Range'] = range;

        const buildResponseHeaders = (res: Response, contentType: string) => {
            const responseHeaders = new Headers({
                'Content-Type': contentType.includes('video') ? contentType : 'video/mp4',
                'Access-Control-Allow-Origin': '*',
                'Accept-Ranges': 'bytes',
            });
            const contentRange = res.headers.get('content-range');
            if (contentRange) responseHeaders.set('Content-Range', contentRange);
            const contentLength = res.headers.get('content-length');
            if (contentLength) responseHeaders.set('Content-Length', contentLength);
            return responseHeaders;
        };

        const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        const response = await fetch(driveUrl, { headers: fetchHeaders, redirect: 'follow' });
        const contentType = response.headers.get('content-type') || '';

        // If Google returned HTML, it means a confirmation page was shown
        if (contentType.includes('text/html')) {
            const html = await response.text();
            const confirmMatch = html.match(/confirm=([0-9A-Za-z_-]+)/);
            const uuidMatch = html.match(/uuid=([0-9A-Za-z_-]+)/);

            if (confirmMatch) {
                const token = confirmMatch[1];
                const uuid = uuidMatch ? uuidMatch[1] : '';
                const confirmedUrl = `https://drive.google.com/uc?export=download&confirm=${token}&id=${fileId}${uuid ? `&uuid=${uuid}` : ''}`;

                const confirmedResponse = await fetch(confirmedUrl, { headers: fetchHeaders, redirect: 'follow' });
                if (confirmedResponse.body) {
                    return new Response(confirmedResponse.body, {
                        status: confirmedResponse.status,
                        headers: buildResponseHeaders(confirmedResponse, 'video/mp4'),
                    });
                }
            }

            // Fallback: try export=view
            const viewUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
            const viewResponse = await fetch(viewUrl, { headers: fetchHeaders, redirect: 'follow' });
            if (viewResponse.body && !viewResponse.headers.get('content-type')?.includes('text/html')) {
                return new Response(viewResponse.body, {
                    status: viewResponse.status,
                    headers: buildResponseHeaders(viewResponse, 'video/mp4'),
                });
            }

            return NextResponse.json({ error: 'Could not resolve video from Google Drive' }, { status: 502 });
        }

        // Google served the file directly — stream it through with Range support
        if (response.body) {
            return new Response(response.body, {
                status: response.status,
                headers: buildResponseHeaders(response, contentType),
            });
        }

        return NextResponse.json({ error: 'Empty response from Google Drive' }, { status: 502 });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
    }
}
