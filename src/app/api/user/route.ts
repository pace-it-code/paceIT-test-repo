import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../utils/firebase";
import { collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { User } from "../../../../types/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Firestore auto-generates the user ID
    const newUser: Omit<User, "id"> = {
      email,
      name,
      password, // Consider hashing before storing
      cart: [],
    };

    const docRef = await addDoc(collection(db, "users"), newUser);
    const createdUser = { id: docRef.id, ...newUser };

    return NextResponse.json({ success: true, data: createdUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ success: false, error: "Error creating user" }, { status: 500 });
  }
}
export async function GET() {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ success: false, error: "Error fetching users" }, { status: 500 });
  }
}
