import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../utils/firebase";
import { doc, getDoc ,deleteDoc} from "firebase/firestore";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

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
      data: { id: productSnap.id, ...productSnap.data() },
      message: "Successfully fetched product",
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ success: false, error: "Error fetching product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest,{params}:{params: {id: string}}) {
  try {
    
    const { id } = await params;

    if (!id) return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });

    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    await deleteDoc(productRef);

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error deleting product" }, { status: 500 });
  }
}
