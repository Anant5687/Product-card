'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { RecordItem } from '@/lib/encryption';
import { AnimatePresence, motion } from 'framer-motion';

interface CardListProps {
  initialRecords: RecordItem[];
}

const CardList: React.FC<CardListProps> = ({ initialRecords }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  const filteredAndSortedRecords = useMemo(() => {
    let filtered = initialRecords.filter(record =>
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.snippet.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [initialRecords, searchTerm, sortBy]);

  return (
    <div className="container mx-auto p-4">
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-gray-50 rounded-lg shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Search records by title or snippet..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 sm:w-40"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </motion.div>

      <motion.div 
        className="grid gap-6 justify-items-center"
        initial={false}
        layout 
        style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        <AnimatePresence>
          {filteredAndSortedRecords.length > 0 ? (
            filteredAndSortedRecords.map((record) => (
              <ProductCard key={record.id} record={record} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="col-span-full p-10 text-center text-gray-500 text-lg"
            >
              No records found matching your search.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CardList;