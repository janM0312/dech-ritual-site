// Deterministic markdown parser for the site content files in src/content/*.md.
// The .md files are the single source of truth — the build inlines them via ?raw
// imports, so every build produces exactly the same output for the same content.

export type Block = { type: "p"; text: string } | { type: "ul"; items: string[] };

export type MdItem = {
  title: string;
  meta: Record<string, string>;
  body: Block[];
};

export type MdDoc = {
  title: string;
  meta: Record<string, string>;
  body: Block[];
  items: MdItem[];
  outro: Block[];
};

const META_LINE = /^([a-z][a-z0-9_-]*):\s*(.*)$/;
const LIST_ITEM = /^-\s+(.*)$/;

export function parseDoc(raw: string): MdDoc {
  const doc: MdDoc = { title: "", meta: {}, body: [], items: [], outro: [] };
  let current: MdItem | null = null;
  let inOutro = false;
  let paragraph: string[] = [];
  let list: string[] = [];

  const target = () => (current ? current.body : inOutro ? doc.outro : doc.body);

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ").trim();
    paragraph = [];
    if (text) target().push({ type: "p", text });
  };

  const flushList = () => {
    if (list.length === 0) return;
    target().push({ type: "ul", items: list });
    list = [];
  };

  const flush = () => {
    flushParagraph();
    flushList();
  };

  for (const rawLine of raw.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trim();

    if (line === "") {
      flush();
      continue;
    }

    if (line === "---") {
      flush();
      current = null;
      inOutro = true;
      continue;
    }

    if (line.startsWith("## ")) {
      flush();
      current = { title: line.slice(3).trim(), meta: {}, body: [] };
      doc.items.push(current);
      continue;
    }

    if (line.startsWith("# ")) {
      flush();
      current = null;
      doc.title = line.slice(2).trim();
      continue;
    }

    const listItem = LIST_ITEM.exec(line);
    if (listItem) {
      flushParagraph();
      list.push(listItem[1].trim());
      continue;
    }
    if (list.length > 0) flushList();

    // Meta lines ("key: value") are recognized wherever they appear, not just
    // at the start of a block — content authors don't reliably leave a blank
    // line before trailing fields like `cta_primary:`, so a mid-paragraph
    // match still flushes the paragraph gathered so far and registers as meta.
    const meta = META_LINE.exec(line);
    if (meta) {
      flushParagraph();
      (current ? current.meta : doc.meta)[meta[1]] = meta[2].trim();
      continue;
    }

    paragraph.push(line);
  }

  flush();
  return doc;
}
