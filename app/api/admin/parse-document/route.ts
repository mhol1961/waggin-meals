import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.toLowerCase();

    let html = '';
    let title = '';

    if (filename.endsWith('.docx')) {
      // Parse Word document
      const result = await mammoth.convertToHtml(
        { buffer },
        {
          styleMap: [
            // Map Word styles to HTML
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "p[style-name='Heading 3'] => h3:fresh",
            "p[style-name='Title'] => h1.title:fresh",
            "p[style-name='Subtitle'] => h2.subtitle:fresh",
            "p[style-name='Quote'] => blockquote:fresh",
          ],
          convertImage: mammoth.images.imgElement((image) => {
            return image.read('base64').then((imageBuffer) => {
              return {
                src: `data:${image.contentType};base64,${imageBuffer}`,
              };
            });
          }),
        }
      );

      html = result.value;

      // Extract title from first heading or first line
      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      if (titleMatch) {
        title = titleMatch[1].replace(/<[^>]*>/g, ''); // Strip HTML tags
      } else {
        const firstPMatch = html.match(/<p[^>]*>(.*?)<\/p>/i);
        if (firstPMatch) {
          title = firstPMatch[1].replace(/<[^>]*>/g, '').substring(0, 100);
        }
      }

      // Add helpful messages from mammoth
      if (result.messages.length > 0) {
        console.log('Mammoth conversion messages:', result.messages);
      }
    } else if (filename.endsWith('.pdf')) {
      // For PDF, we'll return a helpful message
      // Note: PDF parsing is complex and results vary greatly
      // We can add pdf-parse later if needed
      return NextResponse.json({
        error: 'PDF support coming soon. Please use .docx format for best results, or copy/paste text into the editor.',
      }, { status: 400 });
    } else {
      return NextResponse.json({
        error: 'Unsupported file type. Please upload a .docx file.',
      }, { status: 400 });
    }

    return NextResponse.json({
      html,
      title,
      success: true,
    });
  } catch (error) {
    console.error('Error parsing document:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to parse document',
      },
      { status: 500 }
    );
  }
}
