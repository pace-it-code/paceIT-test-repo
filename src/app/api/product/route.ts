// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../utils/firebase';
import { collection, addDoc ,getDoc,getDocs, query, where, doc, deleteDoc} from 'firebase/firestore';
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, description, category, stock } = body;

    // Validation
    if (!name || !price || !description || !category || !stock) {
      return NextResponse.json({
        success: false,
        error: 'Please provide all required fields'
      }, { status: 400 });
    }

    // Create product object
    const product: Product = {
      name,
      price: Number(price),
      description,
      category,
      stock: Number(stock),
      createdAt: new Date().toISOString()
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, "products"), product);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...product
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Error creating product'
    }, { status: 500 });
  }
}

export async function GET(req:NextResponse) { 
  const productDocs = await getDocs(collection(db,"products"));
  const products = productDocs.docs.map((doc)=>({
    id:doc.id,
    ...doc.data(),
  }));
  if(!products){
    return NextResponse.json({
      success:false,
      error:"No data of product"
    })
  }

  return NextResponse.json({
    success:true,
    data:products,
    msg:"Successfully fetched all products"
  })

}

