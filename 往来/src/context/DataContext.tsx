import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export type FriendEvent = {
  id: string;
  type: string;
  date: string;
  budget: number;
};

export type Friend = {
  id: string;
  userId: string;
  name: string;
  relation: string;
  avatar: string;
  events: FriendEvent[];
  notes: string;
};

export type RecordItem = {
  id: string;
  userId: string;
  title: string;
  personId: string;
  date: string;
  price: number;
  type: '送出' | '收到' | 'sent' | 'received';
  img: string;
};

type DataContextType = {
  friends: Friend[];
  addFriend: (friend: Omit<Friend, 'id' | 'userId'>) => Promise<void>;
  updateFriend: (id: string, friend: Omit<Friend, 'id' | 'userId'>) => Promise<void>;
  getFriend: (id: string) => Friend | undefined;
  records: RecordItem[];
  addRecord: (record: Omit<RecordItem, 'id' | 'userId'>) => Promise<void>;
  userId: string | null;
  isAuthReady: boolean;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !userId) {
      setFriends([]);
      setRecords([]);
      return;
    }

    const friendsQuery = query(collection(db, 'friends'), where('userId', '==', userId));
    const unsubscribeFriends = onSnapshot(friendsQuery, (snapshot) => {
      const friendsData: Friend[] = [];
      snapshot.forEach((doc) => {
        friendsData.push({ id: doc.id, ...doc.data() } as Friend);
      });
      setFriends(friendsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'friends');
    });

    const recordsQuery = query(collection(db, 'records'), where('userId', '==', userId));
    const unsubscribeRecords = onSnapshot(recordsQuery, (snapshot) => {
      const recordsData: RecordItem[] = [];
      snapshot.forEach((doc) => {
        recordsData.push({ id: doc.id, ...doc.data() } as RecordItem);
      });
      setRecords(recordsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'records');
    });

    return () => {
      unsubscribeFriends();
      unsubscribeRecords();
    };
  }, [userId, isAuthReady]);

  const addFriend = async (friend: Omit<Friend, 'id' | 'userId'>) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, 'friends'), {
        ...friend,
        userId
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'friends');
    }
  };

  const updateFriend = async (id: string, updatedFriend: Omit<Friend, 'id' | 'userId'>) => {
    if (!userId) return;
    try {
      const friendRef = doc(db, 'friends', id);
      await updateDoc(friendRef, {
        ...updatedFriend,
        userId
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `friends/${id}`);
    }
  };

  const getFriend = (id: string) => {
    return friends.find(f => f.id === id);
  };

  const addRecord = async (record: Omit<RecordItem, 'id' | 'userId'>) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, 'records'), {
        ...record,
        userId
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'records');
    }
  };

  return (
    <DataContext.Provider value={{ friends, addFriend, updateFriend, getFriend, records, addRecord, userId, isAuthReady }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
