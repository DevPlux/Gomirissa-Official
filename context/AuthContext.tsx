"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

// 1. User ගේ දත්ත වලට Type එකක් හදමු
interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: string;
}

// 2. Context එකේ තිබිය යුතු දේවල් මොනවාද කියා කියමු
interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// 3. Context එක හදනකොට Type එක සම්බන්ධ කරමු (Default value එක any ලෙස දමමු errors මගහරින්න)
const AuthContext = createContext<AuthContextType | any>({});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firestore එකෙන් Role එක ගන්න
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        let userData: UserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: "user", // Default
        };

        if (docSnap.exists()) {
          // Firestore data එක්ක merge කරන්න
          userData = { ...userData, ...docSnap.data() } as UserData;
        } else {
          // අලුත් කෙනෙක් නම් DB එකේ ලියන්න
          const newUser = {
            ...userData,
            createdAt: new Date(),
          };
          await setDoc(docRef, newUser);
        }
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);