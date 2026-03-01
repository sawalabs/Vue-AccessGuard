export function devWarn(message: string) {
  if (import.meta.env.DEV) {
    console.warn(`[AccessGuard] ${message}`);
  }
}
