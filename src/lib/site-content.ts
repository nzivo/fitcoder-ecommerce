/** Merges DB-sourced section content over hardcoded defaults, ignoring null/empty DB fields. */
export function withDefaults<T extends Record<string, unknown>>(
  defaults: T,
  override: Record<string, unknown> | null,
): T {
  if (!override) return defaults;
  const clean = Object.fromEntries(Object.entries(override).filter(([, v]) => v != null));
  return { ...defaults, ...clean };
}
