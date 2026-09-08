import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser for base64 images up to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Warning: GEMINI_API_KEY is not set in environment.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Chữ Nôm AI Decryption and Translation endpoint
app.post('/api/translate-chu-nom', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', context = '' } = req.body;

    if (!imageBase64) {
      res.status(400).json({
        error: 'Thiếu dữ liệu hình ảnh (imageBase64 is required).',
      });
      return;
    }

    // Clean base64 string if data URL prefix exists
    let cleanBase64 = imageBase64;
    let detectedMime = mimeType;
    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      cleanBase64 = parts[1];
      const matchMime = parts[0].match(/data:(.*?)$/);
      if (matchMime && matchMime[1]) {
        detectedMime = matchMime[1];
      }
    }

    const ai = getGeminiClient();

    const promptText = `
You are a distinguished philologist and senior researcher at Viện Việt Học (Institute of Vietnamese Studies), Westminster, California. You specialize in Vietnamese epigraphy, Chữ Nôm (classical demotic script), Sino-Vietnamese (Hán-Việt) etymology, and classical Vietnamese literature (such as Đoạn Trường Tân Thanh / Truyện Kiều by Nguyễn Du, Chinh Phụ Ngâm Khúc, Lục Vân Tiên, royal decrees, temple stele inscriptions, and woodblock prints).

Examine the provided image containing Chữ Nôm / Sino-Vietnamese characters.
${context ? `Context information provided by researcher: "${context}"` : ''}

Your tasks:
1. Identify and transcribe the Chữ Nôm text into digital Unicode characters (CJK Unified Ideographs). Transcribe line by line in proper reading order.
2. Transliterate (phiên âm) into modern Vietnamese Quốc ngữ with standard diacritics, honoring classical poetic cadence, rhythm, and tone harmony.
3. Provide a natural, precise, and expressive modern Vietnamese translation (dịch nghĩa / diễn giảng).
4. Provide an interlinear breakdown (từng chữ): for each line, break down each individual Chữ Nôm character with:
   - nom: the exact Chữ Nôm character
   - quocNgu: the corresponding modern transliteration
   - hanViet: the Sino-Vietnamese root or component if applicable
   - meaning: brief meaning or linguistic note
5. Provide scholarly notes (chú thích học thuật): elucidate archaic words, historical allusions (điển cố điển tích), grammatical particles, or character composition (radical + phonetic).
6. Provide bibliographic and stylistic metadata: script type (Khải thư, Mộc bản, Thảo thư, etc.), estimated historical period/dynasty, and literary genre.

Respond strictly in JSON format matching the schema.
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: detectedMime,
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nomUnicode: {
              type: Type.STRING,
              description: 'Full transcribed Chữ Nôm characters line by line',
            },
            quocNgu: {
              type: Type.STRING,
              description: 'Full modern Vietnamese Quốc ngữ transliteration line by line',
            },
            modernTranslation: {
              type: Type.STRING,
              description: 'Clear, elegant modern Vietnamese translation and meaning',
            },
            scriptType: {
              type: Type.STRING,
              description: 'Calligraphic/engraving style (e.g. Mộc bản khắc gỗ, Khải thư chân phương, Hành thư, Thảo thư)',
            },
            estimatedPeriod: {
              type: Type.STRING,
              description: 'Estimated historical period or dynasty (e.g. Triều Lê, Triều Nguyễn, Thế kỷ XVIII-XIX)',
            },
            literaryGenre: {
              type: Type.STRING,
              description: 'Genre (e.g. Thơ Lục bát, Song thất lục bát, Thơ Đường luật, Sắc phong, Văn tế)',
            },
            summary: {
              type: Type.STRING,
              description: 'Executive summary of the document contents',
            },
            lines: {
              type: Type.ARRAY,
              description: 'Detailed line-by-line and word-by-word breakdown for interlinear view',
              items: {
                type: Type.OBJECT,
                properties: {
                  lineNumber: { type: Type.INTEGER },
                  nomText: { type: Type.STRING },
                  quocNguText: { type: Type.STRING },
                  words: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        nom: { type: Type.STRING },
                        quocNgu: { type: Type.STRING },
                        hanViet: { type: Type.STRING },
                        meaning: { type: Type.STRING },
                      },
                      required: ['nom', 'quocNgu'],
                    },
                  },
                },
                required: ['lineNumber', 'nomText', 'quocNguText'],
              },
            },
            annotations: {
              type: Type.ARRAY,
              description: 'Scholarly notes explaining archaic terms and classical references',
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['term', 'explanation'],
              },
            },
          },
          required: ['nomUnicode', 'quocNgu', 'modernTranslation', 'annotations'],
        },
      },
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Gemini Chữ Nôm translation error:', error);
    const errorStr = String(error?.message || '');
    const isAuthError =
      errorStr.includes('PERMISSION_DENIED') ||
      errorStr.includes('403') ||
      errorStr.includes('denied access');

    const userMessage = isAuthError
      ? 'Khóa API Gemini chưa được kích hoạt quyền truy cập hoặc hạn ngạch trong dự án Google Cloud (quý vị có thể cập nhật GEMINI_API_KEY trong mục Settings > Secrets). Quý vị vẫn có thể trải nghiệm toàn diện bộ công cụ bằng các mẫu mộc bản đối chiếu sẵn trong thư viện.'
      : error?.message || 'Không thể dịch hình ảnh Chữ Nôm. Vui lòng kiểm tra lại hình ảnh hoặc thử lại sau.';

    res.status(isAuthError ? 403 : 500).json({
      success: false,
      error: userMessage,
    });
  }
});

// Vite Middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Viện Việt Học Portal Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
