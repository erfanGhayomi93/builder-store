import type { Direction } from '@store-builder/shared-types';
export function directionForLocale(locale: string): Direction {
  return ['fa', 'ar', 'he', 'ur'].includes(
    locale.toLowerCase().split(/[-_]/)[0],
  )
    ? 'rtl'
    : 'ltr';
}
