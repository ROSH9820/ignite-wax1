"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { whatsappLink, whatsappMessages } from "@/lib/config";
import { useWhatsAppNumber } from "@/lib/use-whatsapp-number";

/**
 * Floating WhatsApp button — bottom-right, appears after a slight scroll so
 * it never covers the hero on first paint. Prefills a general enquiry.
 */
export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const waNumber = useWhatsAppNumber();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.a
      href={whatsappLink(whatsappMessages.general, waNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ignite Wax on WhatsApp"
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={reduced ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_8px_30px_rgba(31,170,85,0.35)] transition-transform hover:scale-105 sm:right-7 sm:bottom-7"
    >
      {/* WhatsApp glyph (thin line style) */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true">
        <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.2L2.2 21.8l4.7-1.4A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.1 15.1l-.3-.17-2.77.83.84-2.7-.19-.31A8.1 8.1 0 0 1 12.04 3.8Zm-3.1 3.9c-.2 0-.5.07-.72.36-.22.3-.86.9-.86 2.18 0 1.29.88 2.53 1 2.7.12.18 1.76 2.87 4.3 3.9 2.12.85 2.55.68 3.01.64.46-.04 1.49-.6 1.7-1.2.21-.58.21-1.08.15-1.19-.07-.1-.24-.16-.5-.29-.27-.13-1.5-.74-1.73-.82-.23-.09-.4-.13-.57.13-.17.27-.66.86-.8 1.03-.15.18-.3.2-.55.07-.27-.13-1.12-.41-2.14-1.32-.79-.7-1.32-1.57-1.47-1.84-.15-.26-.02-.41.11-.54.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.06-.13-.57-1.4-.78-1.91-.2-.5-.41-.43-.57-.44h-.5Z" />
      </svg>
      <span className="sr-only">Chat on WhatsApp</span>
    </motion.a>
  );
}
