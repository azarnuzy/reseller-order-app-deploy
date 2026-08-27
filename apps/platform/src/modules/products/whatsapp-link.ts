const businessNumber = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER ?? "";

export function buildWhatsAppOrderLink(message: string) {
  return `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;
}
