import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firebase_app } from "./config";

const auth = getAuth(firebase_app);

export default async function resetPassword(email) {
  let result = null;
  let error = null;

  try {
    await sendPasswordResetEmail(auth, email);
    result = "Password reset email sent successfully.";
  } catch (e) {
    error = e;
  }

  return { result, error };
}
