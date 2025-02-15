import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../utils/firebase';
import { collection, addDoc, getDocs,getDoc, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { CartItem, Product } from '../../../../types/types';
import { stat } from 'fs';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, productId, quantity } = body;

    if (!userId || !productId || !quantity) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    let cart = userData.cart || [];

    const existingItemIndex = cart.findIndex((item: CartItem) => item.productId === productId);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }

    await updateDoc(userRef, { cart });

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ success: false, error: "Error updating cart" }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    return NextResponse.json({ success: true, cart: userData.cart || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ success: false, error: "Error fetching cart" }, { status: 500 });
  }
}
