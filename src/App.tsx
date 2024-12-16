import React, { useState } from 'react';
import { ScanLine, Plus } from 'lucide-react';
import Scanner from './components/Scanner';
import CardList from './components/CardList';
import SearchBar from './components/SearchBar';
import { useBusinessCards } from './hooks/useBusinessCards';

function App() {
  const [scanning, setScanning] = useState(false);
  const { cards, loading, error, searchQuery, setSearchQuery, refreshCards } = useBusinessCards();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <ScanLine size={32} className="text-blue-500" />
              <h1 className="text-2xl font-bold">名刺スキャナー</h1>
            </div>
            <button
              onClick={() => setScanning(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
              新規スキャン
            </button>
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="名前、会社名、メールアドレスで検索..."
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">読み込み中...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            エラーが発生しました: {error.message}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? '検索結果が見つかりませんでした' : '名刺データがありません'}
          </div>
        ) : (
          <CardList cards={cards} onUpdate={refreshCards} />
        )}
      </main>

      {scanning && (
        <Scanner
          onClose={() => setScanning(false)}
          onScanComplete={refreshCards}
        />
      )}
    </div>
  );
}

export default App;