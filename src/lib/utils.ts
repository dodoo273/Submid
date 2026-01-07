// Utility functions

/**
 * Format price to Indonesian Rupiah format
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (!isFinite(Number(numPrice))) return "0";
  return new Intl.NumberFormat("id-ID").format(Number(numPrice));
}

/**
 * Sanitize string input
 */
export function sanitize(input: string): string {
  return input.trim().replace(/<[^>]*>/g, "");
}

/**
 * Escape HTML entities
 */
export function escapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

/**
 * Get image URL with fallback
 */
export function getImageUrl(
  imageUrl: string | null | undefined,
  type: "menu" | "promo" = "menu"
): string {
  if (!imageUrl) {
    return "/images/no-image.png";
  }

  // External URL
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Local upload
  const folder = type === "promo" ? "promos" : "menu";
  return `/uploads/${folder}/${imageUrl}`;
}

/**
 * Recursively convert Prisma-specific types (Decimal, Date) into plain serializable values
 */
export function serializePrisma<T>(data: T): any {
  if (data === null || typeof data !== "object") return data;

  // Date -> ISO
  if (data instanceof Date) return data.toISOString();

  // Decimal detection (Prisma Decimal class name is usually 'Decimal', but checks props to be safe)
  // Check for specialized Decimal properties (s: sign, e: exponent, d: digits)
  const isDecimal =
    (data as any).s !== undefined &&
    (data as any).e !== undefined &&
    (data as any).d !== undefined &&
    Array.isArray((data as any).d);

  if (isDecimal) return (data as any).toString();

  const ctorName = (data as any).constructor?.name;
  if (ctorName && /Decimal/i.test(ctorName)) return (data as any).toString();

  if (Array.isArray(data)) return data.map((d) => serializePrisma(d));

  const out: Record<string, any> = {};
  for (const key of Object.keys(data as any)) {
    const val = (data as any)[key];
    if (val === null || typeof val !== "object") {
      out[key] = val;
    } else {
      out[key] = serializePrisma(val);
    }
  }
  return out;
}

/**
 * Calculate days left until a date
 */
export function daysLeft(endDate: Date): number {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Site configuration
 */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "SUBMID",
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || "Brewed to Perfection",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsapp: "085704048070",
};
