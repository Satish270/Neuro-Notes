import React from 'react';

// Enums
export enum DifficultyLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert'
}

export enum QuizState {
  Setup = 'Setup',
  Loading = 'Loading',
  Active = 'Active',
  Review = 'Review'
}

// Interfaces
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
  category?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DashboardStat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
}