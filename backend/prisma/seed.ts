/**
 * Database Seed Script
 * Populates the database with demo data for development and testing
 * 
 * Usage:
 *   npx ts-node prisma/seed.ts
 *   OR with npm script:
 *   npm run seed
 */

import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data (in reverse order of foreign keys)
    console.log('🗑️  Clearing existing data...');
    await prisma.savedItem.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.conversationParticipant.deleteMany({});
    await prisma.conversation.deleteMany({});
    await prisma.marketplaceProduct.deleteMany({});
    await prisma.roommateProfile.deleteMany({});
    await prisma.listing.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Database cleared\n');

    // ==================== CREATE USERS ====================
    console.log('👥 Creating demo users...');
    const hashedPassword = await bcryptjs.hash('password123', 10);

    const user1 = await prisma.user.create({
      data: {
        email: 'john@university.edu',
        name: 'John Doe',
        password: hashedPassword,
        university: 'University of California, Berkeley',
        isVerified: true,
        profilePicture: 'https://i.pravatar.cc/150?img=1',
        bio: 'Computer Science student looking for a quiet roommate',
      },
    });

    const user2 = await prisma.user.create({
      data: {
        email: 'jane@university.edu',
        name: 'Jane Smith',
        password: hashedPassword,
        university: 'University of California, Berkeley',
        isVerified: true,
        profilePicture: 'https://i.pravatar.cc/150?img=2',
        bio: 'Business major, love meeting new people',
      },
    });

    const user3 = await prisma.user.create({
      data: {
        email: 'mike@university.edu',
        name: 'Mike Johnson',
        password: hashedPassword,
        university: 'University of California, Berkeley',
        isVerified: true,
        profilePicture: 'https://i.pravatar.cc/150?img=3',
        bio: 'Engineering student, night owl',
      },
    });

    const user4 = await prisma.user.create({
      data: {
        email: 'sarah@university.edu',
        name: 'Sarah Williams',
        password: hashedPassword,
        university: 'University of California, Berkeley',
        isVerified: true,
        profilePicture: 'https://i.pravatar.cc/150?img=4',
        bio: 'Psychology major, early bird',
      },
    });

    const user5 = await prisma.user.create({
      data: {
        email: 'alex@university.edu',
        name: 'Alex Chen',
        password: hashedPassword,
        university: 'University of California, Berkeley',
        isVerified: true,
        profilePicture: 'https://i.pravatar.cc/150?img=5',
        bio: 'Math major, clean and organized',
      },
    });

    console.log('✅ Created 5 demo users\n');

    // ==================== CREATE LISTINGS ====================
    console.log('🏠 Creating demo listings...');

    const listing1 = await prisma.listing.create({
      data: {
        title: 'Modern 2BR Near Campus',
        description: 'Spacious apartment with excellent public transit access. Recently renovated with modern appliances.',
        price: 2500,
        location: 'Near UC Berkeley',
        latitude: 37.8716,
        longitude: -122.2727,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
        ],
        amenities: ['WiFi', 'Parking', 'Laundry', 'Gym'],
        bedrooms: 2,
        bathrooms: 1,
        furnished: true,
        leaseStart: new Date('2024-06-01'),
        leaseEnd: new Date('2025-06-01'),
        petFriendly: false,
        ownerId: user1.id,
      },
    });

    const listing2 = await prisma.listing.create({
      data: {
        title: 'Cozy Studio Apartment',
        description: 'Perfect for one person. Includes utilities. Close to public transportation.',
        price: 1800,
        location: 'Downtown Berkeley',
        latitude: 37.8715,
        longitude: -122.2727,
        images: [
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        ],
        amenities: ['WiFi', 'Utilities Included'],
        bedrooms: 1,
        bathrooms: 1,
        furnished: false,
        petFriendly: true,
        ownerId: user2.id,
      },
    });

    const listing3 = await prisma.listing.create({
      data: {
        title: '3BR House with Backyard',
        description: 'Spacious house with backyard and garden. Two blocks from campus.',
        price: 4200,
        location: 'North Berkeley',
        latitude: 37.8816,
        longitude: -122.2627,
        images: [
          'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=400',
        ],
        amenities: ['Garden', 'Backyard', 'Parking', 'WiFi'],
        bedrooms: 3,
        bathrooms: 2,
        furnished: false,
        leaseStart: new Date('2024-07-01'),
        petFriendly: true,
        ownerId: user1.id,
      },
    });

    console.log('✅ Created 3 demo listings\n');

    // ==================== CREATE ROOMMATE PROFILES ====================
    console.log('👥 Creating demo roommate profiles...');

    const roommate1 = await prisma.roommateProfile.create({
      data: {
        userId: user2.id,
        age: 20,
        university: 'University of California, Berkeley',
        major: 'Business Administration',
        budget: 1500,
        interests: ['Gaming', 'Movies', 'Board Games', 'Cooking'],
        sleepSchedule: 'flexible',
        cleanliness: 'somewhat_clean',
        smoking: false,
        partying: true,
        bio: 'Looking for fun roommates who like to hang out and have good times!',
      },
    });

    const roommate2 = await prisma.roommateProfile.create({
      data: {
        userId: user3.id,
        age: 21,
        university: 'University of California, Berkeley',
        major: 'Mechanical Engineering',
        budget: 1200,
        interests: ['Sports', 'Tech', 'Hiking', 'Photography'],
        sleepSchedule: 'night_owl',
        cleanliness: 'very_clean',
        smoking: false,
        partying: false,
        bio: 'Night owl engineer seeking quiet living space for focus and study.',
      },
    });

    const roommate3 = await prisma.roommateProfile.create({
      data: {
        userId: user4.id,
        age: 19,
        university: 'University of California, Berkeley',
        major: 'Psychology',
        budget: 1300,
        interests: ['Art', 'Music', 'Yoga', 'Reading'],
        sleepSchedule: 'early_bird',
        cleanliness: 'very_clean',
        smoking: false,
        partying: false,
        bio: 'Early bird psych student who loves art and peaceful mornings.',
      },
    });

    console.log('✅ Created 3 demo roommate profiles\n');

    // ==================== CREATE MARKETPLACE PRODUCTS ====================
    console.log('🛒 Creating demo marketplace products...');

    const product1 = await prisma.marketplaceProduct.create({
      data: {
        title: 'Used MacBook Pro 2020',
        description: 'Excellent condition, barely used. Includes charger and protective case.',
        price: 800,
        condition: 'excellent',
        category: 'electronics',
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
        sellerId: user3.id,
      },
    });

    const product2 = await prisma.marketplaceProduct.create({
      data: {
        title: 'Organic Chemistry Textbook',
        description: 'Current edition, minimal highlighting. Perfect for spring semester.',
        price: 45,
        condition: 'good',
        category: 'textbooks',
        images: ['https://images.unsplash.com/photo-150784272343-583f20270319?w=400'],
        sellerId: user1.id,
      },
    });

    const product3 = await prisma.marketplaceProduct.create({
      data: {
        title: 'IKEA Queen Bed Frame',
        description: 'Quality frame, recently purchased. Must go by end of semester.',
        price: 120,
        condition: 'like_new',
        category: 'furniture',
        images: ['https://images.unsplash.com/photo-1540932626-d4b558d8a09b?w=400'],
        sellerId: user2.id,
      },
    });

    const product4 = await prisma.marketplaceProduct.create({
      data: {
        title: 'Desk Lamp LED',
        description: 'Energy efficient, adjustable brightness. Perfect for studying.',
        price: 25,
        condition: 'excellent',
        category: 'electronics',
        images: ['https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=400'],
        sellerId: user5.id,
      },
    });

    console.log('✅ Created 4 demo marketplace products\n');

    // ==================== CREATE CONVERSATIONS ====================
    console.log('💬 Creating demo conversations...');

    const conversation1 = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: user1.id },
            { userId: user2.id },
          ],
        },
      },
    });

    await prisma.message.create({
      data: {
        content: 'Hi! Is your apartment still available?',
        senderId: user2.id,
        conversationId: conversation1.id,
      },
    });

    await prisma.message.create({
      data: {
        content: 'Yes! Want to schedule a viewing?',
        senderId: user1.id,
        conversationId: conversation1.id,
      },
    });

    const conversation2 = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: user3.id },
            { userId: user4.id },
          ],
        },
      },
    });

    await prisma.message.create({
      data: {
        content: 'Hey! Interested in sharing a place?',
        senderId: user3.id,
        conversationId: conversation2.id,
      },
    });

    console.log('✅ Created 2 demo conversations\n');

    // ==================== CREATE NOTIFICATIONS ====================
    console.log('🔔 Creating demo notifications...');

    await prisma.notification.createMany({
      data: [
        {
          title: 'New Message',
          message: 'Jane asked about your apartment listing',
          type: 'message',
          userId: user1.id,
        },
        {
          title: 'Listing Viewed',
          message: 'Mike viewed your 2BR apartment',
          type: 'listing',
          userId: user1.id,
        },
        {
          title: 'Roommate Match',
          message: 'Sarah has similar interests - check her profile!',
          type: 'roommate',
          userId: user3.id,
        },
        {
          title: 'Product Interest',
          message: 'Someone is interested in your MacBook Pro',
          type: 'product',
          userId: user3.id,
        },
      ],
    });

    console.log('✅ Created 4 demo notifications\n');

    // ==================== CREATE SAVED ITEMS ====================
    console.log('⭐ Creating demo saved items...');

    await prisma.savedItem.createMany({
      data: [
        {
          userId: user2.id,
          itemType: 'listing',
          itemId: listing1.id,
        },
        {
          userId: user3.id,
          itemType: 'roommate',
          itemId: roommate1.id,
        },
        {
          userId: user4.id,
          itemType: 'product',
          itemId: product1.id,
        },
      ],
    });

    console.log('✅ Created saved items\n');

    // ==================== SUMMARY ====================
    console.log('✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨');
    console.log('✨  DATABASE SEED COMPLETE!                            ✨');
    console.log('✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨\n');

    console.log('📊 Seed Data Summary:');
    console.log('   • 5 Users created');
    console.log('   • 3 Listings created');
    console.log('   • 3 Roommate Profiles created');
    console.log('   • 4 Marketplace Products created');
    console.log('   • 2 Conversations with 3 messages');
    console.log('   • 4 Notifications created');
    console.log('   • 3 Saved items created\n');

    console.log('🔐 Login Credentials:');
    console.log('   Email: john@university.edu');
    console.log('   Password: password123\n');
    console.log('   Email: jane@university.edu');
    console.log('   Password: password123\n');
    console.log('   Email: mike@university.edu');
    console.log('   Password: password123\n');

    console.log('🚀 Ready to start development!');
  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute seed
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
