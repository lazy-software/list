import LZString from 'lz-string';
import type { TodoItem, TodoList } from '../types';

type SearchLocation = Pick<URL, 'search' | 'hash'>;

export function encodeList(list: TodoList): string {
    const json = JSON.stringify(list);
    return LZString.compressToEncodedURIComponent(json);
}

export function decodeList(encoded: string): TodoList | null {
    try {
        const json = LZString.decompressFromEncodedURIComponent(encoded);
        if (!json) return null;
        return sanitizeList(JSON.parse(json));
    } catch (e) {
        console.error('Failed to decode list', e);
        return null;
    }
}

export function sanitizeList(raw: unknown): TodoList | null {
    if (!raw || typeof raw !== 'object') return null;
    const list = raw as Record<string, unknown>;
    if (typeof list.name !== 'string' || !list.name.trim() || !Array.isArray(list.items)) {
        return null;
    }

    const items: TodoItem[] = [];
    for (const entry of list.items) {
        if (!entry || typeof entry !== 'object') continue;
        const item = entry as Record<string, unknown>;
        if (typeof item.text !== 'string' || !item.text.trim()) continue;
        const sanitized: TodoItem = {
            id: typeof item.id === 'string' && item.id ? item.id : crypto.randomUUID(),
            text: item.text.trim(),
            completed: Boolean(item.completed),
        };
        if (typeof item.snoozedUntil === 'number') {
            sanitized.snoozedUntil = item.snoozedUntil;
        }
        items.push(sanitized);
    }

    return {
        id: typeof list.id === 'string' && list.id ? list.id : crypto.randomUUID(),
        name: list.name.trim(),
        items,
    };
}

export function cloneListForImport(list: TodoList): TodoList {
    return {
        id: crypto.randomUUID(),
        name: list.name,
        items: list.items.map((item) => ({
            ...item,
            id: crypto.randomUUID(),
        })),
    };
}

export function createShareUrl(
    list: TodoList,
    location: Pick<Location, 'origin' | 'pathname'> = window.location,
): string {
    return `${location.origin}${location.pathname}?data=${encodeList(list)}`;
}

export function extractEncodedShare(input: string): string {
    const normalized = normalizeSharePaste(input);
    if (!normalized) return '';
    return extractDataParam(normalized) ?? normalized;
}

export function parseShareInput(input: string): TodoList | null {
    const normalized = normalizeSharePaste(input);
    if (!normalized) return null;

    const candidates: string[] = [];
    const addCandidate = (value: string | null | undefined) => {
        if (!value) return;
        if (!candidates.includes(value)) candidates.push(value);
        try {
            const decoded = decodeURIComponent(value);
            if (decoded && !candidates.includes(decoded)) candidates.push(decoded);
        } catch {
            // Ignore invalid percent-encoding.
        }
    };

    addCandidate(extractDataParam(normalized));
    addCandidate(normalized);
    addCandidate(normalized.replace(/[\n\r]/g, ''));

    for (const line of normalized.split(/\s+/)) {
        addCandidate(extractDataParam(line));
        addCandidate(line);
    }

    for (const candidate of candidates) {
        const list = decodeList(candidate);
        if (list) return list;
    }

    return null;
}

function normalizeSharePaste(input: string): string {
    return input.trim().replace(/^['"]+|['"]+$/g, '');
}

function extractDataParam(input: string): string | null {
    const fromAbsoluteUrl = readShareDataFromLocationSafe(input);
    if (fromAbsoluteUrl) return fromAbsoluteUrl;

    if (!/^[a-z][a-z0-9+.-]*:/i.test(input)) {
        const fromHostUrl = readShareDataFromLocationSafe(`https://${input}`);
        if (fromHostUrl) return fromHostUrl;
    }

    const match = input.match(/[?&#]data=([^&\s#]+)/i);
    if (!match?.[1]) return null;
    try {
        return decodeURIComponent(match[1]);
    } catch {
        return match[1];
    }
}

function readShareDataFromLocationSafe(input: string): string | null {
    try {
        return readShareDataFromLocation(new URL(input));
    } catch {
        return null;
    }
}

export function readShareDataFromLocation(location: SearchLocation = window.location): string | null {
    const fromQuery = new URLSearchParams(location.search).get('data');
    if (fromQuery) return fromQuery;

    const hash = location.hash.startsWith('#') ? location.hash.slice(1) : location.hash;
    if (!hash) return null;
    return new URLSearchParams(hash).get('data');
}

export function clearShareDataFromLocation(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('data');

    if (url.hash) {
        const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
        if (hashParams.has('data')) {
            hashParams.delete('data');
            const nextHash = hashParams.toString();
            url.hash = nextHash;
        }
    }

    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(window.history.state, '', next);
}
