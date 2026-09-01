export function displayNameOrEmail(displayName: string, email: string): string {
  const trimmed = displayName.trim();
  return trimmed.length > 0 ? trimmed : email;
}
