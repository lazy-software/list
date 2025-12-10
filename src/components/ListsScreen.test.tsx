import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListsScreen } from './ListsScreen';
import type { TodoList } from '../types';

describe('ListsScreen', () => {
    const mockLists: TodoList[] = [
        { id: '1', name: 'Groceries', items: [] },
        { id: '2', name: 'Work', items: [] },
    ];

    const defaultProps = {
        lists: mockLists,
        activeListId: '1',
        onAddList: vi.fn(),
        onDeleteList: vi.fn(),
        onSelectList: vi.fn(),
        onImportList: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows list name in delete confirmation dialog', () => {
        render(<ListsScreen {...defaultProps} />);

        // Mock window.confirm
        const confirmSpy = vi.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(() => true);

        // Find the delete button for the first list (Groceries)
        // The delete button has a title "Delete list"
        const deleteButtons = screen.getAllByTitle('Delete list');
        fireEvent.click(deleteButtons[0]);

        expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete "Groceries"?');
        expect(defaultProps.onDeleteList).toHaveBeenCalledWith('1');

        confirmSpy.mockRestore();
    });

    it('does not delete if confirmation is cancelled', () => {
        render(<ListsScreen {...defaultProps} />);

        const confirmSpy = vi.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(() => false);

        const deleteButtons = screen.getAllByTitle('Delete list');
        fireEvent.click(deleteButtons[0]);

        expect(confirmSpy).toHaveBeenCalled();
        expect(defaultProps.onDeleteList).not.toHaveBeenCalled();

        confirmSpy.mockRestore();
    });
});
