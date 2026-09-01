export type ButtonVariant = "primary" | "secondary";

export function labelForVariant(variant: ButtonVariant): string {
  return variant === "primary" ? "Continue" : "Cancel";
}
