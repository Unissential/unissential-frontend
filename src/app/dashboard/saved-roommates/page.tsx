'use client';

import { motion } from 'framer-motion';
import { Heart, MapPin, Star } from 'lucide-react';
import { useState } from 'react';

const mockSavedListings = [];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SavedRoommatesPage() {
  const roommates = mockSavedListings.filter((item) => item.type === 'roommate');
  const [savedRoommates, setSavedRoommates] = useState(roommates);

  const handleRemove = (id: string) => {
    setSavedRoommates((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item} className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">Saved Roommates</h1>
        <p className="text-neutral-600">
          {savedRoommates.length} saved roommate profile{savedRoommates.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Grid */}
      {savedRoommates.length > 0 ? (
        <motion.div
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {savedRoommates.map((roommate) => (
            <motion.div
              key={roommate.id}
              variants={item}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              {/* Header Image */}
              <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 h-24">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md"
                >
                  <Heart size={18} className="text-red-500 fill-red-500" />
                </motion.button>
              </div>

              {/* Profile Content */}
              <div className="p-6 -mt-10 space-y-4">
                {/* Avatar and Name */}
                <div className="flex items-start gap-4">
                  <img
                    src={roommate.image}
                    alt={roommate.title}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                  />
                  <div className="flex-1 pt-2">
                    <h3 className="font-bold text-neutral-900">{roommate.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-orange-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 pt-2 border-t border-neutral-200">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin size={16} className="text-neutral-600 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">{roommate.location}</span>
                  </div>
                  {roommate.detail && (
                    <p className="text-xs text-neutral-600 bg-neutral-50 p-2 rounded-lg">
                      {roommate.detail}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full px-4 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View Profile
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleRemove(roommate.id)}
                  className="w-full px-4 py-2.5 border border-neutral-200 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Remove
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={item} className="text-center py-16">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">No saved roommates yet</h3>
          <p className="text-neutral-600 mb-6">Browse and save roommate profiles you're interested in</p>
          <motion.button
            whileHover={{ scale: 1.05, x: 4 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            Explore Roommates →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
