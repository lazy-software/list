import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTodoApp } from '../hooks/useTodoApp';

describe('useTodoApp Sorting Repro', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should sort items case-insensitively', () => {
        const { result } = renderHook(() => useTodoApp());

        act(() => {
            result.current.addList('My List');
        });

        act(() => {
            result.current.addItem('banana');
            result.current.addItem('Apple');
            result.current.addItem('cherry');
        });

        // If case-sensitive, 'Apple' (65) < 'banana' (98) < 'cherry' (99).
        // If standard ASCII sort: Apple, banana, cherry.
        // Wait, 'a' is 97. 'A' is 65.
        // 'b' is 98.
        // So 'Apple' comes before 'banana'.

        // What if we have 'apple' and 'Banana'?
        // 'Banana' (66) < 'apple' (97).
        // So 'Banana' comes before 'apple'.

        // Expected alphabetical: apple, Banana, cherry.

        const items = result.current.activeList?.items.map(i => i.text);
        console.log('Items:', items);

        // We want case-insensitive sorting usually.
        // Let's see what we get.
    });

    it('should sort mixed case correctly', () => {
        const { result } = renderHook(() => useTodoApp());

        act(() => {
            result.current.addList('My List');
        });

        act(() => {
            result.current.addItem('zebra');
            result.current.addItem('Apple');
        });

        // Expect Apple, zebra
        expect(result.current.activeList?.items.map(i => i.text)).toEqual(['Apple', 'zebra']);

        act(() => {
            result.current.addItem('banana');
        });

        // Expect Apple, banana, zebra
        expect(result.current.activeList?.items.map(i => i.text)).toEqual(['Apple', 'banana', 'zebra']);
    });

    it('should sort case-insensitively (apple vs Banana)', () => {
        const { result } = renderHook(() => useTodoApp());

        act(() => {
            result.current.addList('My List');
        });

        act(() => {
            result.current.addItem('apple');
            result.current.addItem('Banana');
        });

        // If case-sensitive (ASCII): Banana, apple
        // If case-insensitive: apple, Banana
        expect(result.current.activeList?.items.map(i => i.text)).toEqual(['apple', 'Banana']);
    });

    it('should sort Milk and Apple correctly', () => {
        const { result } = renderHook(() => useTodoApp());

        act(() => {
            result.current.addList('Groceries');
        });

        act(() => {
            result.current.addItem('Milk');
            result.current.addItem('Apple');
        });

        // Should be Apple, Milk
        expect(result.current.activeList?.items.map(i => i.text)).toEqual(['Apple', 'Milk']);
    });
});
