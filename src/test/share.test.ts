import { describe, it, expect } from 'vitest';
import LZString from 'lz-string';
import {
    encodeList,
    decodeList,
    createShareUrl,
    extractEncodedShare,
    readShareDataFromLocation,
    cloneListForImport,
    parseShareInput,
} from '../utils/share';
import type { TodoList } from '../types';

describe('share utils', () => {
    const mockList: TodoList = {
        id: 'test-id',
        name: 'Test List',
        items: [
            { id: 'item-1', text: 'Buy milk', completed: false },
            { id: 'item-2', text: 'Walk dog', completed: true }
        ]
    };

    it('should encode and decode a list correctly', () => {
        const encoded = encodeList(mockList);
        expect(encoded).toBeDefined();
        expect(typeof encoded).toBe('string');
        expect(encoded.length).toBeGreaterThan(0);

        const decoded = decodeList(encoded);
        expect(decoded).toEqual(mockList);
    });

    it('should return null for invalid encoded string', () => {
        const decoded = decodeList('invalid-string');
        expect(decoded).toBeNull();
    });

    it('should return null for valid json but invalid list structure', () => {
        const encoded = LZString.compressToEncodedURIComponent(JSON.stringify({ id: '1' }));
        expect(decodeList(encoded)).toBeNull();
    });

    it('builds a share URL that can be extracted again', () => {
        const url = createShareUrl(mockList, { origin: 'https://list.lazy.software', pathname: '/' });
        expect(url).toContain('https://list.lazy.software/?data=');
        expect(extractEncodedShare(url)).toBe(encodeList(mockList));
        expect(decodeList(extractEncodedShare(url))).toEqual(mockList);
    });

    it('reads share data from query or hash', () => {
        const encoded = encodeList(mockList);
        expect(readShareDataFromLocation(new URL(`https://example.com/?data=${encoded}`))).toBe(encoded);
        expect(readShareDataFromLocation(new URL(`https://example.com/#data=${encoded}`))).toBe(encoded);
    });

    it('clones a list with new ids for import', () => {
        const imported = cloneListForImport(mockList);
        expect(imported.id).not.toBe(mockList.id);
        expect(imported.name).toBe(mockList.name);
        expect(imported.items).toHaveLength(2);
        expect(imported.items[0].id).not.toBe(mockList.items[0].id);
        expect(imported.items[0].text).toBe('Buy milk');
    });

    it('parses share links and raw share codes', () => {
        const code = encodeList(mockList);
        const url = createShareUrl(mockList, { origin: 'https://list.lazy.software', pathname: '/' });

        expect(parseShareInput(code)?.name).toBe('Test List');
        expect(parseShareInput(url)?.name).toBe('Test List');
        expect(parseShareInput(`list.lazy.software/?data=${code}`)?.name).toBe('Test List');
        expect(parseShareInput(`Here's the list ${url} enjoy`)?.name).toBe('Test List');
        expect(parseShareInput(`"${url}"`)?.name).toBe('Test List');
        expect(parseShareInput(`Lazy List share code:\n${code}`)?.name).toBe('Test List');
        expect(parseShareInput('not a list')).toBeNull();
    });
});
