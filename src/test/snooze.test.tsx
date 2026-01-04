import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodoApp } from '../hooks/useTodoApp';

describe('useTodoApp Snooze Logic', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // clear localStorage for a fresh state
        localStorage.clear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should snoop completed items and remove them from view', () => {
        const { result } = renderHook(() => useTodoApp());

        // 1. Add item
        act(() => {
            result.current.addList('Default List');
        });

        act(() => {
            result.current.addItem('Test Item');
        });

        // 2. Complete item
        const item = result.current.activeList?.items.find(i => i.text === 'Test Item');
        expect(item).toBeDefined();
        if (item) {
            act(() => {
                result.current.toggleItem(item.id);
            });
        }

        expect(result.current.activeList?.items.find(i => i.text === 'Test Item')?.completed).toBe(true);

        // 3. Snooze for 1 hour
        act(() => {
            result.current.snoozeCompletedItems(60 * 60 * 1000);
        });

        // 4. Verify filtered out
        expect(result.current.activeList?.items.find(i => i.text === 'Test Item')).toBeUndefined();
    });

    it('should bring snoozed items back after duration', () => {
        const { result } = renderHook(() => useTodoApp());

        // Setup: Add -> Complete -> Snooze
        act(() => {
            result.current.addList('Default List');
        });

        act(() => {
            result.current.addItem('Test Item');
        });
        const itemId = result.current.activeList!.items[0].id;
        act(() => {
            result.current.toggleItem(itemId);
            result.current.snoozeCompletedItems(1000); // 1 second
        });

        // Verify gone
        expect(result.current.activeList?.items.find(i => i.id === itemId)).toBeUndefined();

        // Fast forward time
        act(() => {
            vi.advanceTimersByTime(1001);
        });

        // Verify back
        // Trigger a re-render to re-calculate sortedActiveList with the new time
        act(() => {
            result.current.addItem('Dummy');
        });

        const returnedItem = result.current.activeList?.items.find(i => i.id === itemId);
        expect(returnedItem).toBeDefined();
        expect(returnedItem?.snoozedUntil).toBeDefined();
    });
});
