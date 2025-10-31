import { Payment, generatePayments } from "./payments.mock";

const ALL = generatePayments(1000, 20250824);

export type PaymentsQuery = {
  pageNumber: number; // 1-based
  pageSize: number;
  search?: string;
  sortBy?: keyof Payment;
  sortDir?: "asc" | "desc";
};

export async function getPaymentsPaged(q: PaymentsQuery) {
  // simulate network
  await new Promise((r) => setTimeout(r, 250));

  let filtered = ALL;
  if (q.search) {
    const s = q.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.email.toLowerCase().includes(s) ||
        p.id.toLowerCase().includes(s) ||
        p.status.toLowerCase().includes(s)
    );
  }

  if (q.sortBy) {
    filtered = [...filtered].sort((a, b) => {
      const av = a[q.sortBy!],
        bv = b[q.sortBy!];
      if (av < bv) return q.sortDir === "desc" ? 1 : -1;
      if (av > bv) return q.sortDir === "desc" ? -1 : 1;
      return 0;
    });
  }

  const totalRowsCount = filtered.length;
  const numberOfPages = Math.max(1, Math.ceil(totalRowsCount / q.pageSize));
  const pageIndex0 = Math.max(0, Math.min(q.pageNumber - 1, numberOfPages - 1));
  const start = pageIndex0 * q.pageSize;
  const data = filtered.slice(start, start + q.pageSize);

  return {
    data,
    totalRowsCount,
    pageNumber: q.pageNumber,
    pageSize: q.pageSize,
    numberOfPages,
    code: 100
  };
}
