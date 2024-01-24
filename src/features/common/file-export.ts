import { Document, Paragraph, Packer, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { marked } from 'marked';

interface MessageType {
  role: string;
  content: string;
}

class CustomRenderer extends marked.Renderer {
  paragraph(text: string): string {
    return `<p>${text}</p>`;
  }

  strong(text: string): string {
    return `<strong>${text}</strong>`;
  }

  em(text: string): string {
    return `<em>${text}</em>`;
  }

  heading(text: string, level: number): string {
    return `<h${level}>${text}</h${level}>`;
  }

  link(href: string, title: string | null | undefined, text: string): string {
    return `<a href="${href}" title="${title || ''}">${text}</a>`;
  }

  image(href: string, title: string | null, text: string): string {
    return `<img src="${href}" alt="${text}" title="${title || ''}" />`;
  }

  list(body: string, ordered: boolean): string {
    const tag = ordered ? 'ol' : 'ul';
    return `<${tag}>${body}</${tag}>`;
  }

  listitem(text: string): string {
    return `<li>${text}</li>`;
  }

  blockquote(quote: string): string {
    return `<blockquote>${quote}</blockquote>`;
  }

  code(code: string, infostring: string | undefined, escaped: boolean): string {
    return `<pre><code>${escaped ? code : this.escape(code)}</code></pre>`;
  }

  codespan(text: string): string {
    return `<code>${text}</code>`;
  }

  br(): string {
    return `<br />`;
  }

  private escape(code: string): string {
    return code.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#39;');
  }

  del(text: string): string {
    return `<del>${text}</del>`;
  }

  // Add more overrides for other Markdown elements as needed
}

const createParagraphFromHtml = (html: string): Paragraph[] => {
    const paragraphs: Paragraph[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
  
    const processNode = (node: ChildNode): void => {
      if (node.textContent && node.textContent.trim() !== '') {
        switch (node.nodeName) {
          case 'P':
            paragraphs.push(new Paragraph(node.textContent.trim()));
            break;
          case 'STRONG':
            paragraphs.push(new Paragraph({
              children: [new TextRun({ text: node.textContent.trim(), bold: true })]
            }));
            break;
          case 'EM':
            paragraphs.push(new Paragraph({
              children: [new TextRun({ text: node.textContent.trim(), italics: true })]
            }));
            break;
          case 'H1': case 'H2': case 'H3': case 'H4': case 'H5': case 'H6':
            paragraphs.push(new Paragraph({
              text: node.textContent.trim(),
              heading: HeadingLevel[`HEADING_${node.nodeName.charAt(1)}` as keyof typeof HeadingLevel],
            }));
            break;
          case 'UL': case 'OL':
            const listItems = node.childNodes;
            listItems.forEach(li => {
              processNode(li);
            });
            break;
          case 'BLOCKQUOTE':
            paragraphs.push(new Paragraph({
              children: [new TextRun({
                text: node.textContent.trim(),
                italics: true
              })],
              indent: { left: 720 }
            }));
            break;
          case 'LI':
            paragraphs.push(new Paragraph({
              text: node.textContent.trim(),
              bullet: { level: 0 }
            }));
            break;
          // Add more cases for other HTML elements as needed
        }
      }
    };
  
    doc.body.childNodes.forEach(processNode);
    return paragraphs;
  };
  


export const convertMarkdownToWordDocument = async (messages: MessageType[], fileName: string, aiName: string) => {

        const renderer = new CustomRenderer();
    marked.use({ renderer });

    const messageParagraphPromises = messages.map(async message => {
        const author = message.role === 'system' || message.role === 'assistant' ? aiName : "You";
        const authorParagraph = new Paragraph({
        text: `${author}:`,
        heading: HeadingLevel.HEADING_2,
        });

        const content = await marked.parse(message.content);
        const contentParagraphs = createParagraphFromHtml(content);

        return [authorParagraph, ...contentParagraphs, new Paragraph('')];
    });

    const messageParagraphs = (await Promise.all(messageParagraphPromises)).flat();

    const doc = new Document({
        sections: [{ children: messageParagraphs }],
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, fileName);
    });
};

