import { useState, useRef, useEffect } from 'react';
import { useTodoApp } from './hooks/useTodoApp';
import { BottomNav } from './components/BottomNav';
import { ListsScreen } from './components/ListsScreen';
import { ItemsScreen } from './components/ItemsScreen';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'items' | 'lists'>('items');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const {
    lists,
    activeListId,
    activeList,
    addList,
    deleteList,
    setActiveList,
    addItem,
    toggleItem,
    deleteCompletedItems,
    snoozeCompletedItems,
    importList
  } = useTodoApp();

  return (
    <div className="h-[100dvh] bg-gray-100 dark:bg-gray-950 transition-colors duration-200 flex flex-col overflow-hidden pt-[env(safe-area-inset-top)]">
      <div className="max-w-md mx-auto w-full h-full bg-white dark:bg-gray-900 shadow-2xl relative transition-colors duration-200 flex flex-col overflow-hidden">


        {/* Main Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto pt-4">
          {activeTab === 'items' ? (
            <ItemsScreen
              activeList={activeList}
              onAddItem={addItem}
              onToggleItem={toggleItem}
            />
          ) : (
            <ListsScreen
              lists={lists}
              activeListId={activeListId}
              onAddList={addList}
              onDeleteList={deleteList}
              onSelectList={(id) => {
                setActiveList(id);
              }}
              onImportList={importList}
            />
          )}
        </main>


        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'items' && activeList && activeList.items.some(i => i.completed) && (() => {
          const completedCount = activeList.items.filter(i => i.completed).length;
          return (
            <div className="absolute right-4 bottom-[calc(6rem+env(safe-area-inset-bottom,20px))] z-50 flex flex-col gap-3 items-end">
              {/* Snooze Button */}
              <button
                onClick={() => {
                  if (window.confirm(`Snooze ${completedCount} completed item${completedCount !== 1 ? 's' : ''} for 1 hour?`)) {
                    snoozeCompletedItems(60 * 60 * 1000); // 1 hour
                  }
                }}
                className="flex items-center justify-center p-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full shadow-lg shadow-blue-600/30 dark:shadow-blue-900/40 hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all duration-200"
                aria-label="Snooze completed items for 1 hour"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Clear Button */}
              <button
                onClick={() => {
                  if (window.confirm(`Remove ${completedCount} completed item${completedCount !== 1 ? 's' : ''}?`)) {
                    deleteCompletedItems();
                  }
                }}
                className="flex items-center justify-center p-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full shadow-lg shadow-blue-600/30 dark:shadow-blue-900/40 hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default App;
