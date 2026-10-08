import React from 'react';
import { Quote } from 'lucide-react';
import { TocItem } from './blog-table-of-contents';

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractTableOfContents(markdown: string): TocItem[] {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const items: TocItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      const title = trimmed.replace(/^##\s+/, '').trim();
      items.push({
        id: slugifyHeading(title),
        title,
        level: 2,
      });
    } else if (trimmed.startsWith('### ')) {
      const title = trimmed.replace(/^###\s+/, '').trim();
      items.push({
        id: slugifyHeading(title),
        title,
        level: 3,
      });
    }
  }

  return items;
}

interface BlogArticleBodyProps {
  content?: string;
}

export function BlogArticleBody({ content = '' }: BlogArticleBodyProps) {
  if (!content) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm">
        Konten artikel belum tersedia.
      </div>
    );
  }

  // Parse lines into structured blocks
  const blocks: React.ReactNode[] = [];
  const rawLines = content.split('\n');
  let currentList: { ordered: boolean; items: string[] } | null = null;
  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join(' ').trim();
      if (text) {
        blocks.push(
          <p
            key={`p-${blocks.length}`}
            className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-5"
          >
            {formatInlineText(text)}
          </p>
        );
      }
      currentParagraphLines = [];
    }
  };

  const flushList = () => {
    if (currentList && currentList.items.length > 0) {
      if (currentList.ordered) {
        blocks.push(
          <ol
            key={`ol-${blocks.length}`}
            className="list-decimal pl-5 sm:pl-6 space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-6 leading-relaxed"
          >
            {currentList.items.map((item, idx) => (
              <li key={idx} className="pl-1">
                {formatInlineText(item)}
              </li>
            ))}
          </ol>
        );
      } else {
        blocks.push(
          <ul
            key={`ul-${blocks.length}`}
            className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-6 leading-relaxed"
          >
            {currentList.items.map((item, idx) => (
              <li key={idx} className="pl-1">
                {formatInlineText(item)}
              </li>
            ))}
          </ul>
        );
      }
      currentList = null;
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i] ?? '';
    const trimmed = line.trim();

    // Blank line -> flush active paragraph or list
    if (trimmed === '') {
      flushParagraph();
      flushList();
      continue;
    }

    // Heading 2
    if (trimmed.startsWith('## ')) {
      flushParagraph();
      flushList();
      const title = trimmed.replace(/^##\s+/, '').trim();
      const id = slugifyHeading(title);
      blocks.push(
        <h2
          key={`h2-${id}-${blocks.length}`}
          id={id}
          className="scroll-mt-32 text-xl sm:text-2xl font-semibold font-sans tracking-tight text-slate-900 dark:text-white mt-10 mb-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 first:border-none first:pt-0 first:mt-0"
        >
          {title}
        </h2>
      );
      continue;
    }

    // Heading 3
    if (trimmed.startsWith('### ')) {
      flushParagraph();
      flushList();
      const title = trimmed.replace(/^###\s+/, '').trim();
      const id = slugifyHeading(title);
      blocks.push(
        <h3
          key={`h3-${id}-${blocks.length}`}
          id={id}
          className="scroll-mt-32 text-base sm:text-lg font-semibold font-sans tracking-tight text-slate-900 dark:text-white mt-6 mb-3"
        >
          {title}
        </h3>
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushParagraph();
      flushList();
      const quoteText = trimmed.replace(/^>\s+/, '').replace(/^"(.*)"$/, '$1').trim();
      blocks.push(
        <blockquote
          key={`quote-${blocks.length}`}
          className="my-8 rounded-2xl bg-[#FDF0F5] dark:bg-pink-950/20 border-l-4 border-[#ef599a] p-5 sm:p-6 text-slate-800 dark:text-slate-200 relative overflow-hidden shadow-xs"
        >
          <Quote className="size-8 text-[#ef599a]/20 absolute right-4 bottom-3 pointer-events-none" />
          <p className="font-sans italic text-sm sm:text-base leading-relaxed relative z-10 text-slate-800 dark:text-pink-100">
            &ldquo;{quoteText}&rdquo;
          </p>
        </blockquote>
      );
      continue;
    }

    // Numbered list item
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      flushParagraph();
      const itemContent = numberedMatch[2] ?? '';
      if (!currentList || !currentList.ordered) {
        flushList();
        currentList = { ordered: true, items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      continue;
    }

    // Bullet list item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      const itemContent = trimmed.substring(2).trim();
      if (!currentList || currentList.ordered) {
        flushList();
        currentList = { ordered: false, items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      continue;
    }

    // Sub-item in list (e.g., indented bullets like "   - item")
    if (line.startsWith('   - ') || line.startsWith('  - ')) {
      const subContent = line.replace(/^\s+-\s+/, '').trim();
      if (currentList) {
        currentList.items.push(subContent);
      } else {
        currentList = { ordered: false, items: [subContent] };
      }
      continue;
    }

    // Default regular paragraph line
    currentParagraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();

  return <div className="blog-prose">{blocks}</div>;
}

/**
 * Format inline markdown markers: **bold**, *italic*, `code`, and links [text](url)
 */
function formatInlineText(text: string): React.ReactNode {
  // Regex to split by markdown tokens
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // **Bold**
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // *Italic*
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="font-sans italic text-slate-800 dark:text-slate-200">
          {part.slice(1, -1)}
        </em>
      );
    }

    // `Code`
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // [Link](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const label = linkMatch[1] ?? '';
      const url = linkMatch[2] ?? '';
      const isInternal = url.startsWith('/');
      return (
        <a
          key={index}
          href={url}
          target={isInternal ? undefined : '_blank'}
          rel={isInternal ? undefined : 'noopener noreferrer'}
          className="text-[#ef599a] hover:text-[#df488a] font-medium underline underline-offset-4 transition-colors"
        >
          {label}
        </a>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
