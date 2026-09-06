/**
 * Vietnamese Typography and Diacritics Normalization Utility
 * 
 * Ensures all Vietnamese text strictly uses precomposed Unicode (NFC) and fixes
 * all legacy, VIQR, shorthand, or font-incompatibility anomalies where diacritics
 * render as separated characters or ticks (such as "ầ" vs "â`", "ế" vs "ê'", "ồ" vs "ô`").
 */

// Mapping of modified vowels with tone marks (grave `, acute ', hook ?, tilde ~, dot .)
const COMPOUND_VOWEL_REPLACEMENTS: [RegExp, string][] = [
  // --- Â / â (a circumflex) ---
  [/â[`ˋ\\]/g, 'ầ'],
  [/â['´’ˊ]/g, 'ấ'],
  [/â[?̉ˀ]/g, 'ẩ'],
  [/â[~˜]/g, 'ẫ'],
  [/â\.(?=[^\s]|$)/g, 'ậ'],
  [/â\./g, 'ậ'],

  [/Â[`ˋ\\]/g, 'Ầ'],
  [/Â['´’ˊ]/g, 'Ấ'],
  [/Â[?̉ˀ]/g, 'Ẩ'],
  [/Â[~˜]/g, 'Ẫ'],
  [/Â\.(?=[^\s]|$)/g, 'Ậ'],
  [/Â\./g, 'Ậ'],

  // --- Ă / ă (a breve) ---
  [/ă[`ˋ\\]/g, 'ằ'],
  [/ă['´’ˊ]/g, 'ắ'],
  [/ă[?̉ˀ]/g, 'ẳ'],
  [/ă[~˜]/g, 'ẵ'],
  [/ă\.(?=[^\s]|$)/g, 'ặ'],
  [/ă\./g, 'ặ'],

  [/Ă[`ˋ\\]/g, 'Ằ'],
  [/Ă['´’ˊ]/g, 'Ắ'],
  [/Ă[?̉ˀ]/g, 'Ẳ'],
  [/Ă[~˜]/g, 'Ẵ'],
  [/Ă\.(?=[^\s]|$)/g, 'Ặ'],
  [/Ă\./g, 'Ặ'],

  // --- Ê / ê (e circumflex) ---
  [/ê[`ˋ\\]/g, 'ề'],
  [/ê['´’ˊ]/g, 'ế'],
  [/ê[?̉ˀ]/g, 'ể'],
  [/ê[~˜]/g, 'ễ'],
  [/ê\.(?=[^\s]|$)/g, 'ệ'],
  [/ê\./g, 'ệ'],

  [/Ê[`ˋ\\]/g, 'Ề'],
  [/Ê['´’ˊ]/g, 'Ế'],
  [/Ê[?̉ˀ]/g, 'Ể'],
  [/Ê[~˜]/g, 'Ễ'],
  [/Ê\.(?=[^\s]|$)/g, 'Ệ'],
  [/Ê\./g, 'Ệ'],

  // --- Ô / ô (o circumflex) ---
  [/ô[`ˋ\\]/g, 'ồ'],
  [/ô['´’ˊ]/g, 'ố'],
  [/ô[?̉ˀ]/g, 'ổ'],
  [/ô[~˜]/g, 'ỗ'],
  [/ô\.(?=[^\s]|$)/g, 'ộ'],
  [/ô\./g, 'ộ'],

  [/Ô[`ˋ\\]/g, 'Ồ'],
  [/Ô['´’ˊ]/g, 'Ố'],
  [/Ô[?̉ˀ]/g, 'Ổ'],
  [/Ô[~˜]/g, 'Ỗ'],
  [/Ô\.(?=[^\s]|$)/g, 'Ộ'],
  [/Ô\./g, 'Ộ'],

  // --- Ơ / ơ (o horn) ---
  [/ơ[`ˋ\\]/g, 'ờ'],
  [/ơ['´’ˊ]/g, 'ớ'],
  [/ơ[?̉ˀ]/g, 'ở'],
  [/ơ[~˜]/g, 'ỡ'],
  [/ơ\.(?=[^\s]|$)/g, 'ợ'],
  [/ơ\./g, 'ợ'],

  [/Ơ[`ˋ\\]/g, 'Ờ'],
  [/Ơ['´’ˊ]/g, 'Ớ'],
  [/Ơ[?̉ˀ]/g, 'Ở'],
  [/Ơ[~˜]/g, 'Ỡ'],
  [/Ơ\.(?=[^\s]|$)/g, 'Ợ'],
  [/Ơ\./g, 'Ợ'],

  // --- Ư / ư (u horn) ---
  [/ư[`ˋ\\]/g, 'ừ'],
  [/ư['´’ˊ]/g, 'ứ'],
  [/ư[?̉ˀ]/g, 'ử'],
  [/ư[~˜]/g, 'ữ'],
  [/ư\.(?=[^\s]|$)/g, 'ự'],
  [/ư\./g, 'ự'],

  [/Ư[`ˋ\\]/g, 'Ừ'],
  [/Ư['´’ˊ]/g, 'Ứ'],
  [/Ư[?̉ˀ]/g, 'Ử'],
  [/Ư[~˜]/g, 'Ữ'],
  [/Ư\.(?=[^\s]|$)/g, 'Ự'],
  [/Ư\./g, 'Ự'],

  // --- Standard base vowels with acute or grave or hook or tilde (followed by tone mark) ---
  [/a[`ˋ\\]/g, 'à'],
  [/A[`ˋ\\]/g, 'À'],
  [/a[~˜]/g, 'ã'],
  [/A[~˜]/g, 'Ã'],

  [/e[`ˋ\\]/g, 'è'],
  [/E[`ˋ\\]/g, 'È'],
  [/e[~˜]/g, 'ẽ'],
  [/E[~˜]/g, 'Ẽ'],

  [/i[`ˋ\\]/g, 'ì'],
  [/I[`ˋ\\]/g, 'Ì'],
  [/i[~˜]/g, 'ĩ'],
  [/I[~˜]/g, 'Ĩ'],

  [/o[`ˋ\\]/g, 'ò'],
  [/O[`ˋ\\]/g, 'Ò'],
  [/o[~˜]/g, 'õ'],
  [/O[~˜]/g, 'Õ'],

  [/u[`ˋ\\]/g, 'ù'],
  [/U[`ˋ\\]/g, 'Ù'],
  [/u[~˜]/g, 'ũ'],
  [/U[~˜]/g, 'Ũ'],

  [/y[`ˋ\\]/g, 'ỳ'],
  [/Y[`ˋ\\]/g, 'Ỳ'],
  [/y[~˜]/g, 'ỹ'],
  [/Y[~˜]/g, 'Ỹ'],

  // --- Base vowels with apostrophe when within a word (e.g., c'a -> cá, th'ơ -> thơ) ---
  [/([b-df-hj-np-tv-zđB-DF-HJ-NP-TV-ZĐ])a['´’ˊ](?=[a-zđA-ZĐ]|\b)/g, '$1á'],
  [/([b-df-hj-np-tv-zđB-DF-HJ-NP-TV-ZĐ])e['´’ˊ](?=[a-zđA-ZĐ]|\b)/g, '$1é'],
  [/([b-df-hj-np-tv-zđB-DF-HJ-NP-TV-ZĐ])i['´’ˊ](?=[a-zđA-ZĐ]|\b)/g, '$1í'],
  [/([b-df-hj-np-tv-zđB-DF-HJ-NP-TV-ZĐ])o['´’ˊ](?=[a-zđA-ZĐ]|\b)/g, '$1ó'],
  [/([b-df-hj-np-tv-zđB-DF-HJ-NP-TV-ZĐ])u['´’ˊ](?=[a-zđA-ZĐ]|\b)/g, '$1ú'],
  [/([b-df-hj-np-tv-zđB-DF-HJ-NP-TV-ZĐ])y['´’ˊ](?=[a-zđA-ZĐ]|\b)/g, '$1ý'],

  // Base vowels with hook question mark within a word
  [/([b-df-hj-np-tv-zđB-DF-HJ-NP-TV-ZĐ])a\?(?=[a-zđA-ZĐ])/g, '$1ả'],
  [/([b-df-hj-np-tv-zđB-DF-HJ-NP-TV-ZĐ])e\?(?=[a-zđA-ZĐ])/g, '$1ẻ'],
  [/([b-df-hj-np-tv-zđB-DF-HJ-NP-TV-ZĐ])i\?(?=[a-zđA-ZĐ])/g, '$1ỉ'],
  [/([b-df-hj-np-tv-zđB-DF-HJ-NP-TV-ZĐ])o\?(?=[a-zđA-ZĐ])/g, '$1ỏ'],
  [/([b-df-hj-np-tv-zđB-DF-HJ-NP-TV-ZĐ])u\?(?=[a-zđA-ZĐ])/g, '$1ủ'],
  [/([b-df-hj-np-tv-zđB-DF-HJ-NP-TV-ZĐ])y\?(?=[a-zđA-ZĐ])/g, '$1ỷ'],

  // --- VIQR Caret and Horn Shorthands ---
  // a^ -> â
  [/a\^[`ˋ\\]/g, 'ầ'],
  [/a\^['´’ˊ]/g, 'ấ'],
  [/a\^[?̉ˀ]/g, 'ẩ'],
  [/a\^[~˜]/g, 'ẫ'],
  [/a\^\./g, 'ậ'],
  [/a\^/g, 'â'],

  [/A\^[`ˋ\\]/g, 'Ầ'],
  [/A\^['´’ˊ]/g, 'Ấ'],
  [/A\^[?̉ˀ]/g, 'Ẩ'],
  [/A\^[~˜]/g, 'Ẫ'],
  [/A\^\./g, 'Ậ'],
  [/A\^/g, 'Â'],

  // a( -> ă
  [/a\([`ˋ\\]/g, 'ằ'],
  [/a\(['´’ˊ]/g, 'ắ'],
  [/a\([?̉ˀ]/g, 'ẳ'],
  [/a\([~˜]/g, 'ẵ'],
  [/a\(\./g, 'ặ'],
  [/a\(/g, 'ă'],

  [/A\([`ˋ\\]/g, 'Ằ'],
  [/A\(['´’ˊ]/g, 'Ắ'],
  [/A\([?̉ˀ]/g, 'Ẳ'],
  [/A\([~˜]/g, 'Ẵ'],
  [/A\(\./g, 'Ặ'],
  [/A\(/g, 'Ă'],

  // e^ -> ê
  [/e\^[`ˋ\\]/g, 'ề'],
  [/e\^['´’ˊ]/g, 'ế'],
  [/e\^[?̉ˀ]/g, 'ể'],
  [/e\^[~˜]/g, 'ễ'],
  [/e\^\./g, 'ệ'],
  [/e\^/g, 'ê'],

  [/E\^[`ˋ\\]/g, 'Ề'],
  [/E\^['´’ˊ]/g, 'Ế'],
  [/E\^[?̉ˀ]/g, 'Ể'],
  [/E\^[~˜]/g, 'Ễ'],
  [/E\^\./g, 'Ệ'],
  [/E\^/g, 'Ê'],

  // o^ -> ô
  [/o\^[`ˋ\\]/g, 'ồ'],
  [/o\^['´’ˊ]/g, 'ố'],
  [/o\^[?̉ˀ]/g, 'ổ'],
  [/o\^[~˜]/g, 'ỗ'],
  [/o\^\./g, 'ộ'],
  [/o\^/g, 'ô'],

  [/O\^[`ˋ\\]/g, 'Ồ'],
  [/O\^['´’ˊ]/g, 'Ố'],
  [/O\^[?̉ˀ]/g, 'Ổ'],
  [/O\^[~˜]/g, 'Ỗ'],
  [/O\^\./g, 'Ộ'],
  [/O\^/g, 'Ô'],

  // o+ or o* -> ơ
  [/o[+*][`ˋ\\]/g, 'ờ'],
  [/o[+*]['´’ˊ]/g, 'ớ'],
  [/o[+*][?̉ˀ]/g, 'ở'],
  [/o[+*][~˜]/g, 'ỡ'],
  [/o[+*]\./g, 'ợ'],
  [/o[+*]/g, 'ơ'],

  [/O[+*][`ˋ\\]/g, 'Ờ'],
  [/O[+*]['´’ˊ]/g, 'Ớ'],
  [/O[+*][?̉ˀ]/g, 'Ở'],
  [/O[+*][~˜]/g, 'Ỡ'],
  [/O[+*]\./g, 'Ợ'],
  [/O[+*]/g, 'Ơ'],

  // u+ or u* -> ư
  [/u[+*][`ˋ\\]/g, 'ừ'],
  [/u[+*]['´’ˊ]/g, 'ứ'],
  [/u[+*][?̉ˀ]/g, 'ử'],
  [/u[+*][~˜]/g, 'ữ'],
  [/u[+*]\./g, 'ự'],
  [/u[+*]/g, 'ư'],

  [/U[+*][`ˋ\\]/g, 'Ừ'],
  [/U[+*]['´’ˊ]/g, 'Ứ'],
  [/U[+*][?̉ˀ]/g, 'Ử'],
  [/U[+*][~˜]/g, 'Ữ'],
  [/U[+*]\./g, 'Ự'],
  [/U[+*]/g, 'Ư'],

  // d- or D- -> đ / Đ
  [/\bd-\b/g, 'đ'],
  [/\bD-\b/g, 'Đ'],
  [/d-(?=[aeiouyăâêôơư])/gi, 'đ'],
  [/D-(?=[AEIOUYĂÂÊÔƠƯ])/g, 'Đ']
];

/**
 * Normalizes any text string to ensure standard Vietnamese precomposed Unicode (NFC)
 * and repairs any decomposed or separated diacritic marks.
 */
export function normalizeVietnameseText(str: string | undefined | null): string {
  if (!str) return '';

  // 1. Initial Unicode Composition (NFC): merges separate combining Unicode diacritics
  // into precomposed glyphs (e.g. â + \u0300 -> ầ, ê + \u0301 -> ế)
  let result = str.normalize('NFC');

  // 2. Apply all compound vowel and tone-replacement rules
  for (let i = 0; i < COMPOUND_VOWEL_REPLACEMENTS.length; i++) {
    const [pattern, replacement] = COMPOUND_VOWEL_REPLACEMENTS[i];
    result = result.replace(pattern, replacement);
  }

  // 3. Second NFC pass to ensure any newly formed combinations are canonical NFC
  return result.normalize('NFC');
}
