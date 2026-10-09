import { z } from "zod";

/**
 * Server-side validation schemas.
 * The browser NEVER decides prices, product details or order IDs — the server
 * re-derives everything from the trusted catalog in src/data/products.ts.
 */

export const orderItemSchema = z.object({
  productId: z.string().min(1).max(64),
  quantity: z.number().int().min(1).max(20),
});

export const orderFormSchema = z.object({
  customer: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "Please enter your full name.")
      .max(80, "Name is too long."),
    // International-friendly phone: optional leading +, 7–16 digits with
    // optional spaces/dashes. (v1 ships worldwide; tighten per market later.)
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9][0-9\s-]{6,17}$/, "Please enter a valid phone number."),
    email: z.email("Please enter a valid email address.").max(120),
    address: z
      .string()
      .trim()
      .min(10, "Please enter your complete delivery address (street, city, state and PIN/ZIP).")
      .max(400, "Address is too long."),
    // Optional structured lines — v1 UI uses the single address field.
    city: z.string().trim().max(80).optional().or(z.literal("")),
    state: z.string().trim().max(80).optional().or(z.literal("")),
    pincode: z
      .string()
      .trim()
      .max(10)
      .regex(/^[A-Za-z0-9\s-]*$/, "Please enter a valid PIN/ZIP code.")
      .optional()
      .or(z.literal("")),
  }),
  items: z.array(orderItemSchema).min(1, "Your order is empty.").max(10),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  /** Honeypot — must stay empty. Bots tend to fill every field. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type OrderFormInput = z.infer<typeof orderFormSchema>;

export const paymentNoteSchema = z.object({
  orderId: z
    .string()
    .trim()
    .regex(/^IW-\d{4}-\d{5}$/, "Invalid order reference."),
  utr: z
    .string()
    .trim()
    .min(6, "Reference looks too short.")
    .max(40, "Reference looks too long.")
    .regex(/^[A-Za-z0-9-]+$/, "Only letters, numbers and dashes are allowed."),
});

export type PaymentNoteInput = z.infer<typeof paymentNoteSchema>;

/** Flattens a ZodError into { field: message } for form display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
