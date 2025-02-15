import { NextResponse } from 'next/server';
import { db } from '../../../../utils/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { User } from '../../../../types/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json({
        success: false,
        error: 'Please provide all required fields'
      }, { status: 400 });
    }

    // Check if user exists
    const userQuery = query(collection(db, "users"), where("email", "==", email));
    const userDocs = await getDocs(userQuery);

    if (!userDocs.empty) {
      return NextResponse.json({
        success: false,
        error: 'User already exists'
      }, { status: 400 });
    }

    const user: Omit<User, 'id'> = {
      email,
      name,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "users"), user);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...user
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({
      success: false,
      error: 'Error creating user'
    }, { status: 500 });
  }
}