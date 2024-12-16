import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { BusinessCard } from '../types/BusinessCard';
import EditCardModal from './EditCardModal';
import { updateBusinessCard, deleteBusinessCard } from '../db/database';

interface CardListProps {
  cards: BusinessCard[];
  onUpdate: () => void;
}

export default function CardList({ cards, onUpdate }: CardListProps) {
  const [editingCard, setEditingCard] = useState<BusinessCard | null>(null);

  const handleSave = async (updatedCard: BusinessCard) => {
    await updateBusinessCard(updatedCard);
    onUpdate();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('この名刺を削除してもよろしいですか？')) {
      await deleteBusinessCard(id);
      onUpdate();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold">{card.name}</h3>
                {card.company && (
                  <p className="text-gray-600">{card.company}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCard(card)}
                  className="text-gray-500 hover:text-blue-500 transition-colors"
                  title="編集"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => card.id && handleDelete(card.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  title="削除"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {card.imageUrl && (
              <img
                src={card.imageUrl}
                alt="Business Card"
                className="w-full h-40 object-cover rounded mb-4"
              />
            )}

            {card.title && (
              <p className="text-gray-600 mb-2">{card.title}</p>
            )}
            {card.phone && (
              <p className="text-gray-600 mb-1">📞 {card.phone}</p>
            )}
            {card.email && (
              <p className="text-gray-600 mb-1">✉️ {card.email}</p>
            )}
            {card.address && (
              <p className="text-gray-600">📍 {card.address}</p>
            )}
          </div>
        ))}
      </div>

      {editingCard && (
        <EditCardModal
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}