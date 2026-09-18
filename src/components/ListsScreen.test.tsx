import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListsScreen } from './ListsScreen';
import type { TodoList } from '../types';
import { createShareUrl, encodeList } from '../utils/share';

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

    it('shares a list with the system share sheet', async () => {
        const share = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('navigator', { ...window.navigator, share });

        render(<ListsScreen {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('Share Groceries'));

        await waitFor(() => {
            expect(share).toHaveBeenCalled();
        });
        expect(share.mock.calls[0][0].url).toContain('?data=');
        expect(share.mock.calls[0][0].title).toBe('Groceries');
        expect(share.mock.calls[0][0].text).toBeUndefined();

        vi.unstubAllGlobals();
    });

    it('imports a pasted share link', () => {
        const shared: TodoList = {
            id: 'shared',
            name: 'Party',
            items: [{ id: '1', text: 'Ice', completed: false }],
        };

        render(<ListsScreen {...defaultProps} />);
        fireEvent.click(screen.getByText('Or import a list'));
        fireEvent.change(screen.getByLabelText('Share link'), {
            target: { value: createShareUrl(shared, { origin: 'https://list.lazy.software', pathname: '/' }) },
        });
        fireEvent.submit(screen.getByLabelText('Share link').closest('form')!);

        expect(defaultProps.onImportList).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Party' }),
        );
    });

    it('imports a pasted share code', () => {
        const shared: TodoList = {
            id: 'shared',
            name: 'Party',
            items: [{ id: '1', text: 'Ice', completed: false }],
        };

        render(<ListsScreen {...defaultProps} />);
        fireEvent.click(screen.getByText('Or import a list'));
        fireEvent.change(screen.getByLabelText('Share link'), {
            target: { value: encodeList(shared) },
        });
        fireEvent.submit(screen.getByLabelText('Share link').closest('form')!);

        expect(defaultProps.onImportList).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Party' }),
        );
    });
});
