import { createContext, useState, useEffect, useContext } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  deleteAccount,
  updatePassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  getDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth, db } from "../FirebaseConfig";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    // on AuthStateChanged
    const unsub = onAuthStateChanged(auth, (user) => {
      // console.log("got User", user);
      if (user) {
        updateUserData(user.uid);
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const updateUserData = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      setUser({ ...user, username: data.username, userId: data.uid });
    }
  };
  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("auth/invalid-credential"))
        msg = "Email or Password Wrong";
      if (msg.includes("auth/network-request-failed"))
        msg = "Unable to Login, Please check your internet";
      return { success: false, msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (e) {
      return { success: false, msg: e.message, error: e };
    }
  };

  const register = async (email, password, username, profileUrl) => {
    try {
      const usernameTaken = await isUsernameTaken(username);

      if (usernameTaken) {
        return { msg: "Username Not Available" };
      }

      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("response.user:", response?.user);
      // set User(response?.user)

      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        userId: response?.user?.uid,
        email,
      });
      return { success: true, data: response?.user };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("auth/email-already-in-use"))
        msg = "Email already exist";
      if (msg.includes("auth/username-taken")) msg = "Username Not Available";
      return { success: false, msg };
    }
  };

  const isUsernameTaken = async (username) => {
    try {
      // Query the 'users' collection to check if any document has the given username
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(
        query(usersRef, where("username", "==", username))
      );

      // If there are any documents with the given username, it's taken
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking username:", error);
      throw error;
    }
  };

  const appResetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        appResetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }
  return value;
};
