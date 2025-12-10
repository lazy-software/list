import LZString from 'lz-string';
import type { TodoList } from '../types';

export function encodeList(list: TodoList): string {
    const json = JSON.stringify(list);
    return LZString.compressToEncodedURIComponent(json);
}

export function decodeList(encoded: string): TodoList | null {
    try {
        const json = LZString.decompressFromEncodedURIComponent(encoded);
        if (!json) return null;
        const list = JSON.parse(json);

        // Basic validation
        if (!list || typeof list !== 'object' || !list.id || !list.name || !Array.isArray(list.items)) {
            return null;
        }

        return list as TodoList;
    } catch (e) {
        console.error('Failed to decode list', e);
        return null;
    }
}
