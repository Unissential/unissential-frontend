/**
 * Roommate Compatibility Calculation
 * Logic to calculate compatibility scores between roommates
 */

import { RoommateProfile, CompatibilityScore } from '@/types/roommate';

/**
 * Calculate overall compatibility between current user preferences and a roommate
 * Note: In production, this would compare authenticated user data with roommate
 */
export function calculateCompatibility(
  roommate: RoommateProfile,
  userPreferences: Partial<RoommateProfile>
): CompatibilityScore {
  let totalScore = 0;
  let criteriaCount = 0;

  // Budget compatibility (25 points max)
  const budgetScore = calculateBudgetScore(
    userPreferences.budget || { min: 800, max: 1200 },
    roommate.budget
  );
  totalScore += budgetScore;
  criteriaCount++;

  // Schedule compatibility (25 points max)
  const scheduleScore = calculateScheduleScore(
    userPreferences.sleepSchedule || 'flexible',
    roommate.sleepSchedule
  );
  totalScore += scheduleScore;
  criteriaCount++;

  // Cleanliness compatibility (20 points max)
  const cleanlinessScore = calculateCleanlinessScore(
    userPreferences.cleanlinessLevel || 'clean',
    roommate.cleanlinessLevel
  );
  totalScore += cleanlinessScore;
  criteriaCount++;

  // Interests compatibility (20 points max)
  const interestsScore = calculateInterestsScore(
    userPreferences.interests || [],
    roommate.interests
  );
  totalScore += interestsScore;
  criteriaCount++;

  // Location compatibility (10 points max)
  const locationScore = calculateLocationScore(
    userPreferences.location || 'Austin',
    roommate.location
  );
  totalScore += locationScore;
  criteriaCount++;

  const overall = Math.round(totalScore / criteriaCount);

  return {
    overall,
    budget: budgetScore,
    schedule: scheduleScore,
    cleanliness: cleanlinessScore,
    interests: interestsScore,
    location: locationScore,
    label: getCompatibilityLabel(overall),
  };
}

function calculateBudgetScore(
  userBudget: { min: number; max: number },
  roommatebudget: { min: number; max: number }
): number {
  const userMid = (userBudget.min + userBudget.max) / 2;
  const roommateMid = (roommatebudget.min + roommatebudget.max) / 2;
  const difference = Math.abs(userMid - roommateMid);
  const maxDifference = 600;

  if (difference === 0) return 25;
  if (difference < 200) return 24;
  if (difference < 400) return 20;
  if (difference < maxDifference) return 15;
  return 10;
}

function calculateScheduleScore(userSchedule: string, roommateSchedule: string): number {
  if (userSchedule === roommateSchedule) return 25;
  if (roommateSchedule === 'flexible') return 23;
  if (userSchedule === 'flexible') return 23;

  // Night owl + early bird = 15 (opposite schedules)
  if (
    (userSchedule === 'night-owl' && roommateSchedule === 'early-bird') ||
    (userSchedule === 'early-bird' && roommateSchedule === 'night-owl')
  ) {
    return 15;
  }

  return 20;
}

function calculateCleanlinessScore(userCleanliness: string, roommateCleanliness: string): number {
  const cleanlinessLevels: { [key: string]: number } = {
    'very-clean': 4,
    clean: 3,
    moderate: 2,
    relaxed: 1,
  };

  const userLevel = cleanlinessLevels[userCleanliness] || 2;
  const roommateLevel = cleanlinessLevels[roommateCleanliness] || 2;
  const difference = Math.abs(userLevel - roommateLevel);

  if (difference === 0) return 20;
  if (difference === 1) return 18;
  if (difference === 2) return 14;
  return 10;
}

function calculateInterestsScore(userInterests: string[], roommateInterests: string[]): number {
  if (!userInterests || userInterests.length === 0) return 15;
  if (!roommateInterests || roommateInterests.length === 0) return 15;

  const commonInterests = userInterests.filter((interest) =>
    roommateInterests.includes(interest)
  ).length;

  const totalInterests = new Set([...userInterests, ...roommateInterests]).size;
  const matchPercentage = totalInterests > 0 ? commonInterests / totalInterests : 0;

  if (matchPercentage >= 0.7) return 20;
  if (matchPercentage >= 0.5) return 18;
  if (matchPercentage >= 0.3) return 15;
  if (matchPercentage >= 0.1) return 12;
  return 8;
}

function calculateLocationScore(userLocation: string, roommateLocation: string): number {
  if (userLocation.toLowerCase() === roommateLocation.toLowerCase()) return 10;
  if (
    (userLocation.toLowerCase().includes('austin') && roommateLocation.includes('Austin')) ||
    (userLocation.toLowerCase().includes('lake') && roommateLocation.includes('Lake'))
  ) {
    return 9;
  }
  return 5;
}

function getCompatibilityLabel(
  score: number
): 'great-match' | 'good-match' | 'okay-match' | 'not-ideal' {
  if (score >= 85) return 'great-match';
  if (score >= 70) return 'good-match';
  if (score >= 55) return 'okay-match';
  return 'not-ideal';
}

/**
 * Get color for compatibility score
 */
export function getCompatibilityColor(score: number): string {
  if (score >= 85) return 'from-emerald-500 to-teal-500';
  if (score >= 70) return 'from-blue-500 to-cyan-500';
  if (score >= 55) return 'from-amber-500 to-orange-500';
  return 'from-red-500 to-pink-500';
}

/**
 * Get label text for compatibility
 */
export function getCompatibilityText(label: string): string {
  const labels: { [key: string]: string } = {
    'great-match': '🔥 Great Match!',
    'good-match': '✨ Good Match',
    'okay-match': '👍 Okay Match',
    'not-ideal': '⚠️ Not Ideal',
  };
  return labels[label] || '👤 Match';
}

/**
 * Sort roommates by compatibility
 */
export function sortByCompatibility(
  roommates: RoommateProfile[],
  userPreferences: Partial<RoommateProfile>
): Array<{ roommate: RoommateProfile; compatibility: CompatibilityScore }> {
  const scored = roommates.map((roommate) => ({
    roommate,
    compatibility: calculateCompatibility(roommate, userPreferences),
  }));

  return scored.sort((a, b) => b.compatibility.overall - a.compatibility.overall);
}
