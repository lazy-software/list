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
        // Does the hook re-render? The filtered list is calculated on render.
        // We might need to force an update or check if renderHook handles state updates from timer.
        // 'useTodoApp' derives state from 'activeList' which in turn...
        // Wait, 'useTodoApp' calculates 'sortedActiveList' (which is what we generally consume as 'activeList' if we exposed it directly).
        // BUT 'useTodoApp' exposes 'activeList' which is just the raw list from state?
        // Let's check useTodoApp implementation. 
        // If 'activeList' exposed is the *filtered* one, then it should work.
        // If 'activeList' exposed is the raw one, then we should see the item but with 'snoozedUntil'.

        // Checking useTodoApp.ts:
        // "return { ... activeList: sortedActiveList ... }" 
        // So 'activeList' IS the filtered list.

        // HOWEVER, 'sortedActiveList' uses `Date.now()`. React won't re-render just because time changed.
        // We might need an action to trigger a re-render or the app relies on some other event.
        // In the real app, we don't auto-refresh the list unless user interaction happens or we have a timer interval.
        // Ideally we should assume the list updates on interaction.

        // Let's trigger a dummy action to force re-evaluation
        act(() => {
            result.current.addItem('Dummy');
        });

        const returnedItem = result.current.activeList?.items.find(i => i.id === itemId);
        expect(returnedItem).toBeDefined();
        expect(returnedItem?.snoozedUntil).toBeDefined();
    });
});
