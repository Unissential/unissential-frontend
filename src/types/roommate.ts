/**
 * Roommate Types and Interfaces
 * Complete type definitions for the roommate matching system
 */

export type SleepSchedule = 'early-bird' | 'night-owl' | 'flexible';
export type CleanlinessLevel = 'very-clean' | 'clean' | 'moderate' | 'relaxed';
export type Gender = 'male' | 'female' | 'non-binary' | 'any';

export interface RoommateProfile {
  id: string;
  name: string;
  age: number;
  university: string;
  major: string;
  location: string;
  bio: string;
  photo: string;
  photos: string[];
  budget: {
    min: number;
    max: number;
  };
  moveInDate: string;
  leaseLength: string;
  sleepSchedule: SleepSchedule;
  cleanlinessLevel: CleanlinessLevel;
  gender: Gender;
  interests: string[];
  hobbies: string[];
  pets: {
    allowed: boolean;
    types: string[];
  };
  smoking: 'yes' | 'no' | 'not-applicable';
  studyHabits: string;
  workSchedule: string;
  socialLevel: 'very-social' | 'social' | 'introverted' | 'very-introverted';
  guestPolicy: 'frequent' | 'occasional' | 'minimal';
  noise: 'quiet' | 'moderate' | 'no-preference';
  kitchen: 'share' | 'private' | 'any';
  bathroom: 'share' | 'private' | 'any';
  isFavorite?: boolean;
  joinedDate: string;
  responseRate?: number;
}

export interface CompatibilityScore {
  overall: number;
  budget: number;
  schedule: number;
  cleanliness: number;
  interests: number;
  location: number;
  label: 'great-match' | 'good-match' | 'okay-match' | 'not-ideal';
}

export interface RoommateFilterState {
  searchQuery: string;
  university: string;
  budgetRange: [number, number];
  gender: string;
  sleepSchedule: string;
  cleanlinessLevel: string;
  smoking: string;
  pets: string;
  moveInDate: string;
  interests: string[];
  location: string;
  socialLevel: string;
}

export interface MutualInterest {
  name: string;
  category: 'hobby' | 'interest' | 'activity';
}
