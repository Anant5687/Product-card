'use client';

import { RecordItem } from '@/lib/encryption';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProductCardProps {
  record: RecordItem;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "string", stiffness: 100, damping: 10 } },
};

const ProductCard: React.FC<ProductCardProps> = ({ record }) => {
  return (
    <motion.div
      className="max-w-xs md:max-w-sm w-full bg-white rounded-xl overflow-hidden shadow-lg 
                 hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.01]"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      layout
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          className="w-full h-full object-cover" 
          src={record.image} 
          alt={record.title} 
          width={100}
          height={100}
        />
      </div>

      <div className="p-4 flex flex-col items-center">
        <h2 className="text-xl font-extrabold text-gray-800 mb-1 text-center">
          {record.title}
        </h2>
        
        <p className="text-xs text-gray-500 mb-3 font-mono">
          {record.date}
        </p>

        <p className="text-sm text-gray-600 text-center mb-4">
          <span className="font-semibold text-red-600">Snippet (Encrypted):</span> {record.snippet}
        </p>
        
        <button 
          className="w-full bg-indigo-600 text-white py-2 rounded-lg 
                     hover:bg-indigo-700 transition-colors duration-200 text-sm font-semibold 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => alert(`Viewing details for ${record.title}`)}
        >
          View More Details
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;