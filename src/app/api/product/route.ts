import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../../../../utils/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, price, description, category, stock, images } = body;

    if (!name || !price || !description || !category || !stock || !images || !Array.isArray(images)) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = {
      name,
      description,
      price,
      category,
      stock,
      images,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "products"), newProduct);
    return NextResponse.json({ success: true, data: { id: docRef.id, ...newProduct } }, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ success: false, error: "Error adding product" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const productsSnapshot = await getDocs(collection(db, "products"));
    
    if (productsSnapshot.empty) {
      return NextResponse.json({
        success: false,
        error: "No products found",
      }, { status: 404 });
    }

    const products = productsSnapshot.docs.map((doc: DocumentData) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      data: products,
      message: "Successfully fetched all products",
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({
      success: false,
      error: "Error fetching products",
    }, { status: 500 });
  }
}


