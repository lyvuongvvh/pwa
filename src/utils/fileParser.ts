import * as pdfjsLib from 'pdfjs-dist';
import { normalizeVietnameseText } from './vietnameseTypography';

// Configure pdfjs worker
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
}

export interface ParsedDocumentData {
  title: string;
  textContent: string;
  htmlContent?: string;
  fileDataUrl?: string;
  pageCount?: number;
  wordCount: number;
  summary: string;
  suggestedCategory: string;
}

export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function detectVietnameseCategory(text: string): string {
  const lower = text.toLowerCase();
  const unaccented = removeVietnameseTones(text);

  if (
    lower.includes('lịch sử') ||
    unaccented.includes('lich su') ||
    lower.includes('triều đại') ||
    lower.includes('thế kỷ') ||
    lower.includes('sử ký') ||
    lower.includes('kháng chiến')
  ) {
    return 'Lịch sử';
  }

  if (
    lower.includes('văn học') ||
    unaccented.includes('van hoc') ||
    lower.includes('thơ') ||
    lower.includes('truyện') ||
    lower.includes('thi phẩm') ||
    lower.includes('nghệ thuật') ||
    lower.includes('ca dao')
  ) {
    return 'Văn học & Nghệ thuật';
  }

  if (
    lower.includes('ngôn ngữ') ||
    unaccented.includes('ngon ngu') ||
    lower.includes('chữ nôm') ||
    lower.includes('quốc ngữ') ||
    lower.includes('từ vựng') ||
    lower.includes('văn phạm')
  ) {
    return 'Ngôn ngữ & Chữ viết';
  }

  if (
    lower.includes('triết học') ||
    unaccented.includes('triet hoc') ||
    lower.includes('tư tưởng') ||
    lower.includes('nho giáo') ||
    lower.includes('phật giáo') ||
    lower.includes('đạo học')
  ) {
    return 'Triết học & Tư tưởng';
  }

  if (
    lower.includes('tư liệu') ||
    unaccented.includes('tu lieu') ||
    lower.includes('văn kiện') ||
    lower.includes('văn bản') ||
    lower.includes('hiến chương') ||
    lower.includes('lưu trữ') ||
    lower.includes('tuyên ngôn')
  ) {
    return 'Tư liệu & Văn kiện';
  }

  if (
    lower.includes('nghiên cứu') ||
    unaccented.includes('nghien cuu') ||
    lower.includes('khảo luận') ||
    lower.includes('học thuật') ||
    lower.includes('luận án')
  ) {
    return 'Nghiên cứu';
  }

  return 'Tư liệu & Văn kiện';
}

export async function parseUploadedFile(file: File): Promise<ParsedDocumentData> {
  const fileName = file.name;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  if (extension === 'html' || extension === 'htm') {
    return parseHtmlFile(file);
  } else if (extension === 'pdf') {
    return parsePdfFile(file);
  } else {
    return parseTextFile(file);
  }
}

async function parseHtmlFile(file: File): Promise<ParsedDocumentData> {
  const text = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  // Extract title
  const titleTag = doc.querySelector('title')?.textContent?.trim();
  const h1Tag = doc.querySelector('h1')?.textContent?.trim();
  const rawTitle = titleTag || h1Tag || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const title = normalizeVietnameseText(rawTitle);

  // Clean elements that shouldn't be indexed for text search
  const clone = doc.body ? (doc.body.cloneNode(true) as HTMLElement) : (doc.documentElement.cloneNode(true) as HTMLElement);
  const elementsToRemove = clone.querySelectorAll('script, style, noscript, svg, nav, footer');
  elementsToRemove.forEach((el) => el.remove());

  const rawText = clone.textContent || '';
  const textContent = normalizeVietnameseText(rawText.replace(/\s+/g, ' ').trim());
  const words = textContent.split(/\s+/).filter(Boolean);
  const summary = normalizeVietnameseText(textContent.slice(0, 300) + (textContent.length > 300 ? '...' : ''));
  const suggestedCategory = detectVietnameseCategory(textContent);

  // Read as Data URL for preview
  const fileDataUrl = await readFileAsDataUrl(file);

  return {
    title,
    textContent,
    htmlContent: text,
    fileDataUrl,
    pageCount: 1,
    wordCount: words.length,
    summary,
    suggestedCategory,
  };
}

async function parsePdfFile(file: File): Promise<ParsedDocumentData> {
  const arrayBuffer = await file.arrayBuffer();
  let extractedText = '';
  let numPages = 1;

  try {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    numPages = pdf.numPages;

    const pageTextPromises: Promise<string>[] = [];
    const maxPagesToExtract = Math.min(numPages, 50); // Extract up to 50 pages for volumetric safety

    for (let pageNum = 1; pageNum <= maxPagesToExtract; pageNum++) {
      pageTextPromises.push(
        pdf.getPage(pageNum).then(async (page) => {
          const textContent = await page.getTextContent();
          return textContent.items
            .map((item: any) => ('str' in item ? item.str : ''))
            .join(' ');
        })
      );
    }

    const pageTexts = await Promise.all(pageTextPromises);
    extractedText = pageTexts.join('\n\n');
  } catch (err) {
    console.warn('PDF.js text parsing encountered an issue, falling back to basic extraction:', err);
    extractedText = `PDF Document: ${file.name}\n(Preview available via viewer)`;
  }

  const cleanText = normalizeVietnameseText(extractedText.replace(/\s+/g, ' ').trim());
  const words = cleanText.split(/\s+/).filter(Boolean);
  const title = normalizeVietnameseText(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
  const summary = normalizeVietnameseText(cleanText.slice(0, 300) + (cleanText.length > 300 ? '...' : ''));
  const fileDataUrl = await readFileAsDataUrl(file);
  const suggestedCategory = detectVietnameseCategory(cleanText);

  return {
    title,
    textContent: cleanText,
    fileDataUrl,
    pageCount: numPages,
    wordCount: words.length,
    summary,
    suggestedCategory,
  };
}

async function parseTextFile(file: File): Promise<ParsedDocumentData> {
  const rawText = await file.text();
  const textContent = normalizeVietnameseText(rawText);
  const words = textContent.split(/\s+/).filter(Boolean);
  const title = normalizeVietnameseText(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
  const summary = normalizeVietnameseText(textContent.slice(0, 300) + (textContent.length > 300 ? '...' : ''));

  return {
    title,
    textContent,
    fileDataUrl: await readFileAsDataUrl(file),
    pageCount: 1,
    wordCount: words.length,
    summary,
    suggestedCategory: detectVietnameseCategory(textContent),
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    // If file is smaller than 2MB, store preview data url; otherwise skip to prevent Firestore limit
    if (file.size > 2 * 1024 * 1024) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string) || '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export function extractSearchTokens(text: string): string[] {
  // Use Unicode property escapes to preserve Vietnamese accented letters
  const normalized = normalizeVietnameseText(text);
  const words = normalized
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2 && w.length <= 30);

  // Add non-tone equivalents for each word as well so unaccented search works
  const withUnaccented: string[] = [];
  for (const w of words) {
    withUnaccented.push(w);
    const unaccented = removeVietnameseTones(w);
    if (unaccented !== w) {
      withUnaccented.push(unaccented);
    }
  }

  const unique = Array.from(new Set(withUnaccented));
  return unique.slice(0, 300);
}

export function findKeywordSnippets(content: string, query: string, maxSnippets = 3): { snippet: string; matchWord: string }[] {
  if (!query || !content) return [];

  const normContent = normalizeVietnameseText(content);
  const normQuery = normalizeVietnameseText(query);
  const rawQueryTerms = normQuery
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 1);

  if (rawQueryTerms.length === 0) return [];

  const snippets: { snippet: string; matchWord: string }[] = [];
  const lowerContent = content.toLowerCase();
  const unaccentedContent = removeVietnameseTones(content);

  for (const rawTerm of rawQueryTerms) {
    const term = rawTerm.toLowerCase();
    const unaccentedTerm = removeVietnameseTones(term);

    let searchStart = 0;
    while (searchStart < lowerContent.length && snippets.length < maxSnippets) {
      let idx = lowerContent.indexOf(term, searchStart);
      // Fallback to unaccented search if accented not found
      if (idx === -1 && unaccentedTerm !== term) {
        idx = unaccentedContent.indexOf(unaccentedTerm, searchStart);
      }
      if (idx === -1) break;

      const snippetStart = Math.max(0, idx - 70);
      const snippetEnd = Math.min(content.length, idx + term.length + 100);
      const rawSnippet = content.slice(snippetStart, snippetEnd).trim();
      const snippet = `${snippetStart > 0 ? '...' : ''}${rawSnippet}${snippetEnd < content.length ? '...' : ''}`;

      snippets.push({
        snippet,
        matchWord: rawTerm,
      });

      searchStart = idx + term.length + 80;
    }
    if (snippets.length >= maxSnippets) break;
  }

  return snippets;
}
