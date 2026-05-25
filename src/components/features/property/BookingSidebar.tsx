'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, MessageCircle, Download, X } from 'lucide-react';
import { PropertyDetail } from '@/types/property';

interface BookingSidebarProps {
  property: PropertyDetail;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(property.isFavorite || false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [tourForm, setTourForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
  });
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);
  const [isTourSubmitted, setIsTourSubmitted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="sticky top-24 p-6 rounded-2xl border border-neutral-200 bg-white shadow-lg space-y-4"
    >
      {/* Price */}
      <div className="border-b border-neutral-200 pb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-neutral-900">${property.price}</span>
          <span className="text-neutral-600">/month</span>
        </div>
        <p className="text-sm text-neutral-600 mt-1">{property.duration}</p>
      </div>

      {/* Contact Buttons */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsContactModalOpen(true)}
          className="w-full py-3 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle size={18} />
          Contact Host
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsTourModalOpen(true)}
          className="w-full py-3 px-4 rounded-lg border-2 border-primary-600 hover:bg-primary-50 text-primary-600 font-semibold transition-colors"
        >
          Schedule Tour
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-neutral-200">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFavorite(!isFavorite)}
          className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
            isFavorite
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          <span className="text-sm font-medium">Save</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-lg border border-neutral-200 hover:border-neutral-300 text-neutral-700 transition-all flex items-center justify-center gap-2"
        >
          <Share2 size={18} />
          <span className="text-sm font-medium">Share</span>
        </motion.button>
      </div>

      {/* Key Info */}
      <div className="space-y-3 pt-4 border-t border-neutral-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600">Available</span>
          <span className="text-sm font-semibold text-neutral-900">{property.availability}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600">Lease Period</span>
          <span className="text-sm font-semibold text-neutral-900">{property.duration}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-600">Furnished</span>
          <span className="text-sm font-semibold text-neutral-900 capitalize">
            {property.furnished.split('-').join(' ')}
          </span>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
        <p className="text-xs text-blue-900">
          <strong>Tip:</strong> Contact the host to ask questions and schedule a tour before committing.
        </p>
      </div>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-primary-100 flex-shrink-0">
              <h3 className="text-lg font-bold text-neutral-900">Contact {property.host.name}</h3>
              <button
                onClick={() => {
                  setIsContactModalOpen(false);
                  setIsContactSubmitted(false);
                  setContactForm({ name: '', email: '', phone: '', message: '' });
                }}
                className="p-2 hover:bg-primary-200 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={20} className="text-neutral-600" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              {isContactSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900 mb-2">Message Sent!</h4>
                  <p className="text-neutral-600 mb-6">
                    Your message has been sent to {property.host.name}. They will respond soon.
                  </p>
                  <button
                    onClick={() => {
                      setIsContactModalOpen(false);
                      setIsContactSubmitted(false);
                      setContactForm({ name: '', email: '', phone: '', message: '' });
                    }}
                    className="w-full py-2 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsContactSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="(123) 456-7890"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Hi! I'm interested in this property..."
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsContactModalOpen(false)}
                      className="flex-1 py-2 px-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Tour Scheduling Modal */}
      {isTourModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-blue-50 to-blue-100 flex-shrink-0">
              <h3 className="text-lg font-bold text-neutral-900">Schedule Tour</h3>
              <button
                onClick={() => {
                  setIsTourModalOpen(false);
                  setIsTourSubmitted(false);
                  setTourForm({ name: '', email: '', phone: '', date: '', time: '' });
                }}
                className="p-2 hover:bg-blue-200 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={20} className="text-neutral-600" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              {isTourSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900 mb-2">Tour Scheduled!</h4>
                  <p className="text-neutral-600 mb-6">
                    Your tour for {tourForm.date} at {tourForm.time} has been confirmed. {property.host.name} will meet you at the property.
                  </p>
                  <button
                    onClick={() => {
                      setIsTourModalOpen(false);
                      setIsTourSubmitted(false);
                      setTourForm({ name: '', email: '', phone: '', date: '', time: '' });
                    }}
                    className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsTourSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={tourForm.name}
                      onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={tourForm.email}
                      onChange={(e) => setTourForm({ ...tourForm, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={tourForm.phone}
                      onChange={(e) => setTourForm({ ...tourForm, phone: e.target.value })}
                      placeholder="(123) 456-7890"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={tourForm.date}
                      onChange={(e) => setTourForm({ ...tourForm, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Preferred Time *
                    </label>
                    <select
                      required
                      value={tourForm.time}
                      onChange={(e) => setTourForm({ ...tourForm, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                    >
                      <option value="">Select a time</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsTourModalOpen(false)}
                      className="flex-1 py-2 px-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                    >
                      Schedule Tour
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
