import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BottomNav } from './BottomNav';

describe('BottomNav', () => {
    it('switches tabs without leaving focus on the nav', () => {
        const onTabChange = vi.fn();
        render(
            <>
                <input aria-label="Add item" />
                <BottomNav activeTab="items" onTabChange={onTabChange} />
            </>
        );

        const composer = screen.getByLabelText('Add item');
        composer.focus();
        expect(composer).toHaveFocus();

        const listsTab = screen.getByRole('button', { name: 'Lists' });
        expect(listsTab).toHaveAttribute('tabindex', '-1');

        fireEvent.pointerDown(listsTab);
        fireEvent.click(listsTab);
        fireEvent.focus(listsTab, { relatedTarget: composer });

        expect(onTabChange).toHaveBeenCalledWith('lists');
        expect(listsTab).not.toHaveFocus();
        expect(composer).toHaveFocus();
    });
});
