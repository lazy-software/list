

interface BottomNavProps {
    activeTab: 'items' | 'lists';
    onTabChange: (tab: 'items' | 'lists') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-4 pb-6 shadow-lg z-10">
            <button
                onClick={() => onTabChange('items')}
                className={`flex-1 py-2 text-center font-medium rounded-lg transition-colors ${activeTab === 'items'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:bg-gray-50'
                    }`}
            >
                Items
            </button>
            <div className="w-px bg-gray-200 mx-2"></div>
            <button
                onClick={() => onTabChange('lists')}
                className={`flex-1 py-2 text-center font-medium rounded-lg transition-colors ${activeTab === 'lists'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:bg-gray-50'
                    }`}
            >
                Lists
            </button>
        </div>
    );
}
