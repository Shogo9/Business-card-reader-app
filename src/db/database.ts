import { openDB } from 'idb';
import type { BusinessCard } from '../types/BusinessCard';

const DB_NAME = 'BusinessCardDB';
const STORE_NAME = 'cards';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('createdAt', 'createdAt');
        // 検索用のインデックスを追加
        store.createIndex('name', 'name');
        store.createIndex('company', 'company');
        store.createIndex('email', 'email');
      }
    },
  });
}

export async function searchBusinessCards(query: string): Promise<BusinessCard[]> {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const cards = await store.getAll();
  
  if (!query.trim()) return cards;
  
  const searchTerms = query.toLowerCase().split(' ');
  return cards.filter(card => {
    const searchableText = [
      card.name,
      card.company,
      card.title,
      card.email,
      card.phone,
      card.address
    ].filter(Boolean).join(' ').toLowerCase();
    
    return searchTerms.every(term => searchableText.includes(term));
  });
}

// 既存の関数はそのまま維持
export async function addBusinessCard(card: Omit<BusinessCard, 'id'>) {
  const db = await initDB();
  return db.add(STORE_NAME, card);
}

export async function getAllBusinessCards(): Promise<BusinessCard[]> {
  const db = await initDB();
  return db.getAllFromIndex(STORE_NAME, 'createdAt');
}

export async function deleteBusinessCard(id: number) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}

export async function updateBusinessCard(card: BusinessCard) {
  const db = await initDB();
  return db.put(STORE_NAME, card);
}