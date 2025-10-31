// Deterministic-ish RNG (so data stays stable on refresh)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Payment = {
  id: string;
  amount: number;
  status: "success" | "processing" | "failed";
  email: string;
};

const STATUSES: Payment["status"][] = ["success", "processing", "failed"];

export function generatePayments(count = 200, seed = 42): Payment[] {
  const rnd = mulberry32(seed);
  const items: Payment[] = [];
  for (let i = 0; i < count; i++) {
    const num = Math.floor(rnd() * 900) + 100; // 100-999
    const amount = Math.floor(rnd() * 1000);
    const status = STATUSES[Math.floor(rnd() * STATUSES.length)];
    const name = [
      "ken",
      "abe",
      "monserrat",
      "silas",
      "carmella",
      "laila",
      "amir",
      "nada",
      "karim",
      "reem"
    ][Math.floor(rnd() * 10)];
    items.push({
      id: `${name}-${num}`,
      amount,
      status,
      email: `${name}${num}@example.com`.toLowerCase()
    });
  }
  return items;
}
