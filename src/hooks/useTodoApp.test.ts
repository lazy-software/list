import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTodoApp } from './useTodoApp';

describe('useTodoApp', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should initialize with empty state', () => {
        const { result } = renderHook(() => useTodoApp());
        expect(result.current.lists).toEqual([]);
        expect(result.current.activeListId).toBeNull();
    });

    it('should add a new list', () => {
        const { result } = renderHook(() => useTodoApp());

        act(() => {
            result.current.addList('My New List');
        });

        expect(result.current.lists).toHaveLength(1);
        expect(result.current.lists[0].name).toBe('My New List');
        expect(result.current.activeListId).toBe(result.current.lists[0].id);
    });

    it('should add an item to the active list', () => {
        const { result } = renderHook(() => useTodoApp());

        act(() => {
            result.current.addList('Groceries');
        });

        act(() => {
            result.current.addItem('Milk');
        });

        expect(result.current.activeList?.items).toHaveLength(1);
        expect(result.current.activeList?.items[0].text).toBe('Milk');
        expect(result.current.activeList?.items[0].completed).toBe(false);
    });

    it('should toggle an item completion status', () => {
        const { result } = renderHook(() => useTodoApp());

        act(() => {
            result.current.addList('Groceries');
        });

        act(() => {
            result.current.addItem('Milk');
        });

        const itemId = result.current.activeList!.items[0].id;

        act(() => {
            result.current.toggleItem(itemId);
        });

        expect(result.current.activeList?.items[0].completed).toBe(true);

        act(() => {
            result.current.toggleItem(itemId);
        });

        expect(result.current.activeList?.items[0].completed).toBe(false);
    });

    it('should delete completed items', () => {
        const { result } = renderHook(() => useTodoApp());

        act(() => {
            result.current.addList('Groceries');
        });

        act(() => {
            result.current.addItem('Milk'); // Not completed
            result.current.addItem('Eggs'); // Will be completed
        });

        const eggsId = result.current.activeList!.items[0].id;

        act(() => {
            result.current.toggleItem(eggsId);
        });

        act(() => {
            result.current.deleteCompletedItems();
        });

        expect(result.current.activeList?.items).toHaveLength(1);
        expect(result.current.activeList?.items[0].text).toBe('Milk');
    });

    it('should delete a list', () => {
        const { result } = renderHook(() => useTodoApp());

        act(() => {
            result.current.addList('List 1');
            result.current.addList('List 2');
        });

        const list1Id = result.current.lists[0].id;

        act(() => {
            result.current.deleteList(list1Id);
        });

        expect(result.current.lists).toHaveLength(1);
        expect(result.current.lists[0].name).toBe('List 2');
    });

    it('should sort lists and items alphabetically', () => {
        const { result } = renderHook(() => useTodoApp());

        act(() => {
            result.current.addList('Banana');
            result.current.addList('Apple');
            result.current.addList('Cherry');
        });

        // Check list sorting
        expect(result.current.lists.map(l => l.name)).toEqual(['Apple', 'Banana', 'Cherry']);

        // Select Apple list
        const appleListId = result.current.lists[0].id;
        act(() => {
            result.current.setActiveList(appleListId);
        });

        act(() => {
            result.current.addItem('Zebra');
            result.current.addItem('Ant');
            result.current.addItem('Mango');
        });

        // Check item sorting
        expect(result.current.activeList?.items.map(i => i.text)).toEqual(['Ant', 'Mango', 'Zebra']);
    });

    it('should sort items case-insensitively', () => {
        const { result } = renderHook(() => useTodoApp());

        act(() => {
            result.current.addList('My List');
        });

        act(() => {
            result.current.addItem('apple');
            result.current.addItem('Banana');
            result.current.addItem('cherry');
        });

        // Expect case-insensitive sorting: apple, Banana, cherry
        expect(result.current.activeList?.items.map(i => i.text)).toEqual(['apple', 'Banana', 'cherry']);
    });
});
