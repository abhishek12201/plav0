
'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { UserQuizAttempt } from '@/lib/actions';
import { Timestamp } from 'firebase/firestore';

// Augment the type to include the structure from Firestore
type StoredQuizAttempt = Omit<UserQuizAttempt, 'answers'> & {
    id: string;
    attemptTime: Timestamp | { seconds: number };
    answers?: { [key: string]: string };
    totalQuestions: number;
    topic: string;
};

export function useUserQuizAttempts() {
    const { user } = useUser();
    const firestore = useFirestore();

    const attemptsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, 'users', user.uid, 'quizAttempts'),
            orderBy('attemptTime', 'desc')
        );
    }, [firestore, user]);

    const { data: attempts, isLoading } = useCollection<StoredQuizAttempt>(attemptsQuery);
    
    return { attempts, isLoading };
}
