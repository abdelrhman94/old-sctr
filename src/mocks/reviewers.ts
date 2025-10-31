// mocks/reviewers.ts
export type ReviewerOption = {
  label: string;
  value: number;
  nameEn: string;
  nameAr: string;
};

export type PagedReviewerOptions = {
  data: ReviewerOption[];
  currentPage: number;
  numberOfPages: number;
};

const EN = [
  "Ahmed",
  "Fatimah",
  "Saleh",
  "Sara",
  "Khalid",
  "Aisha",
  "Mona",
  "Hassan",
  "Noura",
  "Abdullah",
  "Rawan",
  "Laila",
  "Omar",
  "Reem",
  "Yousef",
  "Huda",
  "Fahad",
  "Dina",
  "Majed",
  "Rashed"
];
const AR = [
  "أحمد",
  "فاطمة",
  "صالح",
  "سارة",
  "خالد",
  "عائشة",
  "منى",
  "حسن",
  "نورة",
  "عبدالله",
  "روان",
  "ليلى",
  "عمر",
  "ريم",
  "يوسف",
  "هدى",
  "فهد",
  "دينا",
  "ماجد",
  "راشد"
];

// 120 fake reviewers
export const MOCK_REVIEWERS: ReviewerOption[] = Array.from({ length: 120 }).map((_, i) => {
  const idx = i % EN.length;
  const id = i + 1;
  const nameEn = `${EN[idx]} ${id}`;
  const nameAr = `${AR[idx]} ${id}`;
  return { value: id, label: `Dr. ${nameEn}`, nameEn, nameAr };
});

/**
 * Factory that returns a loader matching (search, page) => Promise<{ data, currentPage, numberOfPages }>
 * - pageSize: items per page
 * - failOnce: first call rejects with an Error (useful to test your error lock + Retry)
 * - delayMs: artificial latency
 */
export function makeMockReviewersLoader({
  pageSize = 10,
  failOnce = false,
  delayMs = 300
}: { pageSize?: number; failOnce?: boolean; delayMs?: number } = {}) {
  let hasFailed = false;

  return async function loadReviewers(search: string, page: number): Promise<PagedReviewerOptions> {
    // simulate latency
    await new Promise((r) => setTimeout(r, delayMs));

    if (failOnce && !hasFailed) {
      hasFailed = true;
      throw new Error("Mock: failed to load reviewers");
    }

    const needle = (search ?? "").toLowerCase().trim();
    const filtered = needle
      ? MOCK_REVIEWERS.filter(
          (o) =>
            o.label.toLowerCase().includes(needle) ||
            o.nameEn.toLowerCase().includes(needle) ||
            o.nameAr.includes(needle)
        )
      : MOCK_REVIEWERS;

    const numberOfPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(Math.max(1, page), numberOfPages);
    const start = (currentPage - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, currentPage, numberOfPages };
  };
}
