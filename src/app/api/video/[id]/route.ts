import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: fileId } = await params;

    if (!fileId || fileId.length < 10) {
        return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
    }

    try {
        // Step 1: Try direct download URL
        const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

        const response = await fetch(driveUrl, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            redirect: 'follow',
        });

        const contentType = response.headers.get('content-type') || '';

        // If Google returned HTML, it means a confirmation page was shown
        if (contentType.includes('text/html')) {
            const html = await response.text();

            // Extract the confirm token from the virus-scan warning page
            const confirmMatch = html.match(/confirm=([0-9A-Za-z_-]+)/);
            const uuidMatch = html.match(/uuid=([0-9A-Za-z_-]+)/);

            if (confirmMatch) {
                const token = confirmMatch[1];
                const uuid = uuidMatch ? uuidMatch[1] : '';
                const confirmedUrl = `https://drive.google.com/uc?export=download&confirm=${token}&id=${fileId}${uuid ? `&uuid=${uuid}` : ''}`;

                const confirmedResponse = await fetch(confirmedUrl, {
                    headers: {
                        'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    },
                    redirect: 'follow',
                });

                if (confirmedResponse.body) {
                    return new Response(confirmedResponse.body, {
                        status: 200,
                        headers: {
                            'Content-Type': 'video/mp4',
                            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
                            'Access-Control-Allow-Origin': '*',
                        },
                    });
                }
            }

            // Fallback: try export=view which sometimes bypasses the confirmation
            const viewUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
            const viewResponse = await fetch(viewUrl, {
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                },
                redirect: 'follow',
            });

            if (viewResponse.body && !viewResponse.headers.get('content-type')?.includes('text/html')) {
                return new Response(viewResponse.body, {
                    status: 200,
                    headers: {
                        'Content-Type': 'video/mp4',
                        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
                        'Access-Control-Allow-Origin': '*',
                    },
                });
            }

            return NextResponse.json(
                { error: 'Could not resolve video from Google Drive' },
                { status: 502 }
            );
        }

        // Google served the file directly — stream it through
        if (response.body) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    'Content-Type': contentType.includes('video') ? contentType : 'video/mp4',
                    'Cache-Control': 'public, max-age=86400, s-maxage=86400',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }

        return NextResponse.json({ error: 'Empty response from Google Drive' }, { status: 502 });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
    }
}
