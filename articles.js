const articles = [
  {
    slug: "building-sterling-db-v1",
    title: "Building sterling-db v1: What I Learned",
    publishedAt: "2026-06-10",
    readTime: "8 min read",
    summary:
      "A practical reflection on implementing memtables, WAL, SSTables, bloom filters, and compaction in my own LSM database project.",
    body: [
      "I built sterling-db to understand LSM internals by implementation, not theory alone. The first major win was seeing how the write path composes from WAL and memtable.",
      "From there, I added immutable SSTables, startup recovery, bloom filters, manifest persistence, and background flush/compaction workers. Every step exposed a real tradeoff: memory, read amplification, write amplification, and operational complexity.",
      "The biggest lesson is that each subsystem is easy in isolation, but correctness depends on ordering and durability boundaries between them.",
    ],
  },
  {
    slug: "skip-list-memtable-notes",
    title: "Skip List Memtable Notes",
    publishedAt: "2026-06-03",
    readTime: "6 min read",
    summary:
      "Why skip lists are a practical memtable choice and how iteration semantics shape the rest of an LSM engine.",
    body: [
      "A memtable needs fast writes and sorted iteration. Skip lists provide expected O(log n) updates while preserving key order.",
      "I focused on tombstone semantics early because delete handling affects lookup correctness across memtable and SSTables.",
      "Iterator behavior was key. Once I had a stable, sorted iterator, flushing into SSTables became straightforward.",
    ],
  },
  {
    slug: "wal-recovery-in-practice",
    title: "WAL Recovery in Practice",
    publishedAt: "2026-05-28",
    readTime: "7 min read",
    summary:
      "A practical walkthrough of binary WAL records, CRC checks, replay, and segment rotation during flush handoff.",
    body: [
      "For durability, I implemented an append-only WAL with length-prefixed records and CRC32. Replaying on startup rebuilds the in-memory state.",
      "The key rule is simple: write to WAL before mutating memtable. Everything else builds on this ordering guarantee.",
      "Segment rotation plus safe deletion after flush gave me a much clearer understanding of crash recovery boundaries.",
    ],
  },
  {
    slug: "notes-on-bloom-filters",
    title: "Notes on Bloom Filters for SSTables",
    publishedAt: "2026-05-22",
    readTime: "5 min read",
    summary:
      "How bloom filters reduce unnecessary SSTable reads, and why false positives are acceptable in LSM read paths.",
    body: [
      "Bloom filters are a memory-efficient way to answer one question quickly: could this key exist in this table?",
      "A negative answer is definitive, so lookup can skip that SSTable immediately. A positive answer still needs actual table read.",
      "This tradeoff is perfect for LSM systems with many immutable files where misses can otherwise become expensive.",
    ],
  },
];

function getAllArticles() {
  return [...articles].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

function getArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug) || null;
}

module.exports = {
  getAllArticles,
  getArticleBySlug,
};
