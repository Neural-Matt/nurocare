'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  /** WhatsApp number with country code, no + or spaces. e.g. "260971234567" */
  phoneNumber?: string;
  message?: string;
}

/**
 * Floating WhatsApp support button.
 * Opens a WhatsApp chat with a predefined greeting message.
 * Number is configurable via NEXT_PUBLIC_WHATSAPP_NUMBER env var.
 */
export function WhatsAppButton({
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '260971234567',
  message = 'Hi, I need help with my health cover.',
}: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message);
  const href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#1ebe59] active:scale-95 transition-all duration-200"
    >
      <MessageCircle className="w-5 h-5 fill-white" />
      <span className="text-sm font-semibold hidden sm:block">Need Help?</span>
    </Link>
  );
}
