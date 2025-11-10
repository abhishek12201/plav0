
'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { UserQuizAttempt } from '@/lib/actions';
import { Timestamp } from 'firebase/firestore';
import { dummyAttempts } from '@/lib/dummy-data';
import { useEffect, useState } from 'react';

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
    const [useDummyData, setUseDummyData] = useState(false);

    const attemptsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, 'users', user.uid, 'quizAttempts'),
            orderBy('attemptTime', 'desc')
        );
    }, [firestore, user]);

    const { data: attempts, isLoading: isLiveLoading } = useCollection<StoredQuizAttempt>(attemptsQuery);
    
    // Determine whether to use dummy data
    useEffect(() => {
        if (!isLiveLoading && (!attempts || attempts.length === 0)) {
            setUseDummyData(true);
        } else {
            setUseDummyData(false);
        }
    }, [attempts, isLiveLoading]);

    const isLoading = isLiveLoading && !useDummyData;
    const finalData = useDummyData ? (dummyAttempts as StoredQuizAttempt[]) : attempts;
    
    return { attempts: finalData, isLoading };
}
