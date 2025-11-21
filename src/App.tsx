import { useState } from 'react';
import { useTodoApp } from './hooks/useTodoApp';
import { BottomNav } from './components/BottomNav';
import { ListsScreen } from './components/ListsScreen';
import { ItemsScreen } from './components/ItemsScreen';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'items' | 'lists'>('lists');
  const {
    lists,
    activeListId,
    activeList,
    addList,
    deleteList,
    setActiveList,
    addItem,
    toggleItem,
    deleteCompletedItems
  } = useTodoApp();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen shadow-2xl relative transition-colors duration-200">


        {/* Main Content */}
        <main className="pt-4">
          {activeTab === 'items' ? (
            <ItemsScreen
              activeList={activeList}
              onAddItem={addItem}
              onToggleItem={toggleItem}
              onDeleteCompleted={deleteCompletedItems}
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
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;
