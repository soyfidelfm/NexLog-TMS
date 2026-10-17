/** Maps raw (English) data values to translation keys. Unknown values are returned unchanged. */
const EQUIPMENT: Record<string, string> = {
  'Dry Van': 'equipment.dryVan',
  'Reefer': 'equipment.reefer',
  'Flatbed': 'equipment.flatbed',
  'Intermodal': 'equipment.intermodal',
  'Dedicated': 'equipment.dedicated',
  'Owner Operator': 'equipment.ownerOperator',
  'Specialized': 'equipment.specialized',
};

export function equipmentKey(value: string): string {
  return EQUIPMENT[value] ?? value;
}

/** 'In Transit' -> 'inTransit' */
export function camelKey(value: string): string {
  return value
    .replace(/[^A-Za-z0-9 ]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
}

/** Translation key for a free-text mock-data string: `<ns>.txt.<camelKey (max 48 chars)>`. */
export function textKey(ns: string, text: string): string {
  return `${ns}.txt.${camelKey(text).slice(0, 48)}`;
}
