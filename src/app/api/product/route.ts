import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../../../../utils/firebase";

// pages/api/products.js

import cloudinary from '../../../../utils/cloudinary';



export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extracting fields
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const stock = Number(formData.get("stock"));
    const manufacturer = formData.get("manufacturer") as string;
    const composition = formData.get("composition") as string;
    const commonlyUsedFor = formData.getAll("commonlyUsedFor") as string[];
    const avoidForCrops = formData.getAll("avoidForCrops") as string[];
    const benefits = formData.getAll("benefits") as string[];
    const method = formData.get("method") as string;
    
    const images = formData.getAll("images") as File[];

    // Extracting dosage details
    const doses = JSON.parse(formData.get("doses") as string) as {
      quantity: string;
      seedWeight: string;
      price: number;
    }[];

    if (
      !name ||
      !description ||
      !category ||
      isNaN(stock) ||
      !manufacturer ||
      !composition ||
      !method ||
      !doses.length ||
      !images.length
    ) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Upload images to Cloudinary
    const uploadedImageUrls: string[] = [];
    for (const image of images) {
      const buffer = await image.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");
      const uploadResponse = await cloudinary.uploader.upload(`data:${image.type};base64,${base64Image}`, {
        folder: "products",
      });
      uploadedImageUrls.push(uploadResponse.secure_url);
    }

    // Creating product object
    const newProduct = {
      name,
      description,
      category,
      stock,
      images: uploadedImageUrls,
      createdAt: new Date().toISOString(),
      manufacturer,
      composition,
      commonlyUsedFor,
      avoidForCrops,
      dosage: {
        method,
        doses,
      },
      benefits,
    };

    // Adding to Firestore
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


