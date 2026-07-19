/* Localized link helper — wraps internal paths with the active Paraglide
 * locale prefix so navigation preserves language. Use for every <a href>
 * and goto() to an internal route.
 */

import { localizeHref } from '$lib/paraglide/runtime';

export function link(path: string): string {
	return localizeHref(path);
}
