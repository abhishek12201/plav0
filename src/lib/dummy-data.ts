
// A simple toggle to switch between personas for the demo.
// 'medical' or 'physics'
const ACTIVE_PERSONA = 'medical';

// --- Maria, the Medical Student ---
const medicalStudentAttempts = [
  {
    id: 'med_attempt_1',
    topic: 'Cardiology',
    score: 8,
    totalQuestions: 10,
    attemptTime: { seconds: new Date('2024-07-10T10:00:00Z').getTime() / 1000 },
  },
  {
    id: 'med_attempt_2',
    topic: 'Anatomy',
    score: 6,
    totalQuestions: 10,
    attemptTime: { seconds: new Date('2024-07-15T14:30:00Z').getTime() / 1000 },
  },
  {
    id: 'med_attempt_3',
    topic: 'Pharmacology',
    score: 9,
    totalQuestions: 10,
    attemptTime: { seconds: new Date('2024-07-20T09:00:00Z').getTime() / 1000 },
  },
    {
    id: 'med_attempt_4',
    topic: 'Anatomy',
    score: 8,
    totalQuestions: 10,
    attemptTime: { seconds: new Date('2024-07-22T11:00:00Z').getTime() / 1000 },
  },
   {
    id: 'med_attempt_5',
    topic: 'Cardiology',
    score: 10,
    totalQuestions: 10,
    attemptTime: { seconds: new Date().getTime() / 1000 - 86400 * 2}, // 2 days ago
  },
];

const medicalStudentQuizzes = [
    {
        id: 'med_quiz_1',
        title: 'Cardiac Cycle Basics',
        topic: 'Cardiology',
        difficulty: 'medium',
        questions: [/* ... */],
        createdAt: { seconds: new Date('2024-07-10T09:55:00Z').getTime() / 1000 },
    },
    {
        id: 'med_quiz_2',
        title: 'Skeletal System Overview',
        topic: 'Anatomy',
        difficulty: 'easy',
        questions: [/* ... */],
        createdAt: { seconds: new Date('2024-07-15T14:25:00Z').getTime() / 1000 },
    },
     {
        id: 'med_quiz_3',
        title: 'Intro to Pharmacokinetics',
        topic: 'Pharmacology',
        difficulty: 'hard',
        questions: [/* ... */],
        createdAt: { seconds: new Date().getTime() / 1000 - 86400 * 5}, // 5 days ago
    }
];

// --- Leo, the Physics Student ---
const physicsStudentAttempts = [
  {
    id: 'phy_attempt_1',
    topic: 'Quantum Mechanics',
    score: 7,
    totalQuestions: 10,
    attemptTime: { seconds: new Date('2024-07-11T11:00:00Z').getTime() / 1000 },
  },
  {
    id: 'phy_attempt_2',
    topic: 'Relativity',
    score: 5,
    totalQuestions: 10,
    attemptTime: { seconds: new Date('2024-07-16T15:00:00Z').getTime() / 1000 },
  },
  {
    id: 'phy_attempt_3',
    topic: 'Thermodynamics',
    score: 8,
    totalQuestions: 10,
    attemptTime: { seconds: new Date('2024-07-21T10:00:00Z').getTime() / 1000 },
  },
   {
    id: 'phy_attempt_4',
    topic: 'Relativity',
    score: 7,
    totalQuestions: 10,
    attemptTime: { seconds: new Date('2024-07-24T18:00:00Z').getTime() / 1000 },
  },
  {
    id: 'phy_attempt_5',
    topic: 'Quantum Mechanics',
    score: 9,
    totalQuestions: 10,
    attemptTime: { seconds: new Date().getTime() / 1000 - 86400}, // 1 day ago
  },
];

const physicsStudentQuizzes = [
    {
        id: 'phy_quiz_1',
        title: 'Wave-Particle Duality',
        topic: 'Quantum Mechanics',
        difficulty: 'hard',
        questions: [/* ... */],
        createdAt: { seconds: new Date('2024-07-11T10:55:00Z').getTime() / 1000 },
    },
    {
        id: 'phy_quiz_2',
        title: 'Special Relativity Concepts',
        topic: 'Relativity',
        difficulty: 'medium',
        questions: [/* ... */],
        createdAt: { seconds: new Date('2024-07-16T14:55:00Z').getTime() / 1000 },
    },
    {
        id: 'phy_quiz_3',
        title: 'Laws of Thermodynamics',
        topic: 'Thermodynamics',
        difficulty: 'easy',
        questions: [/* ... */],
        createdAt: { seconds: new Date().getTime() / 1000 - 86400 * 3 }, // 3 days ago
    }
];

// --- Export based on active persona ---
export const dummyAttempts = ACTIVE_PERSONA === 'medical' ? medicalStudentAttempts : physicsStudentAttempts;
export const dummyQuizzes = ACTIVE_PERSONA === 'medical' ? medicalStudentQuizzes : physicsStudentQuizzes;
