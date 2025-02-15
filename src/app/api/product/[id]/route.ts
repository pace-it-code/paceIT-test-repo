// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../utils/firebase';
import { collection, addDoc ,getDoc, query, where, doc, deleteDoc} from 'firebase/firestore';
import { AsyncCallbackSet } from 'next/dist/server/lib/async-callback-set';
import { cloneElement } from 'react';

interface Product {
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  createdAt: string;
}


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {id}= await params;

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product: productSnap.data(), // Extract data from snapshot
      msg: "Successfully fetched product",
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ success: false, error: "Error fetching product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {id}= await params

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const productRef = doc(db, "products", id);
    const productSnap =await getDoc(productRef)
    if (!productSnap.exists()) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
     await deleteDoc(productRef);

    

    return NextResponse.json({
      success: true,
      msg: "Successfully removed the product",
      data:productSnap
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ success: false, error: "Error fetching product" }, { status: 500 });
  }
}
