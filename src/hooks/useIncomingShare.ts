import { useEffect, useRef } from 'react';
import type { TodoList } from '../types';
import { clearShareDataFromLocation, decodeList, readShareDataFromLocation } from '../utils/share';

type LaunchParams = { targetURL?: string };
type LaunchQueue = { setConsumer: (consumer: (params: LaunchParams) => void) => void };

function consumeEncoded(encoded: string | null, onImport: (list: TodoList) => void): void {
    if (!encoded) return;
    const list = decodeList(encoded);
    clearShareDataFromLocation();
    if (list) onImport(list);
}

export function useIncomingShare(onImport: (list: TodoList) => void) {
    const onImportRef = useRef(onImport);
    onImportRef.current = onImport;

    useEffect(() => {
        const importIncoming = (list: TodoList) => onImportRef.current(list);

        consumeEncoded(readShareDataFromLocation(), importIncoming);

        const consumeCurrentLocation = () => {
            consumeEncoded(readShareDataFromLocation(), importIncoming);
        };

        window.addEventListener('pageshow', consumeCurrentLocation);
        window.addEventListener('popstate', consumeCurrentLocation);

        const launchQueue = (window as Window & { launchQueue?: LaunchQueue }).launchQueue;
        launchQueue?.setConsumer((params) => {
            if (!params.targetURL) return;
            try {
                consumeEncoded(readShareDataFromLocation(new URL(params.targetURL)), importIncoming);
            } catch {
                // Ignore malformed launch URLs.
            }
        });

        return () => {
            window.removeEventListener('pageshow', consumeCurrentLocation);
            window.removeEventListener('popstate', consumeCurrentLocation);
        };
    }, []);
}
