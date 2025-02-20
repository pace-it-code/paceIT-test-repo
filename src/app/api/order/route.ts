import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../utils/firebase";
import { collection, addDoc, doc, getDoc, where, query, getDocs } from "firebase/firestore";
import { Order } from "../../../../types/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    // Get user document
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Get cart items from user data
    const userData = userSnap.data();
    const cartItems = userData.cart || [];

    if (cartItems.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    // Fetch product prices from Firestore
    let totalAmount = 0;
    const updatedCartItems = await Promise.all(
      cartItems.map(async (item: { productId: string; quantity: number }) => {
        const productRef = doc(db, "products", item.productId);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
          console.warn(`Product ${item.productId} not found, skipping...`);
          return null;
        }

        const productData = productSnap.data();
        const price = productData.price || 0; // Ensure price exists
        totalAmount += item.quantity * price;

        return {
          productId: item.productId,
          quantity: item.quantity,
          price, // Add price to the order
        };
      })
    );

    // Remove null values from the updated cart (if any products were missing)
    const finalCartItems = updatedCartItems.filter((item) => item !== null);

    if (finalCartItems.length === 0) {
      return NextResponse.json({ success: false, error: "No valid products found in cart" }, { status: 400 });
    }

    // Create new order
    const newOrder = {
      userId,
      items: finalCartItems,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Add order to Firestore
    const docRef = await addDoc(collection(db, "orders"), newOrder);

    return NextResponse.json({ success: true, data: { id: docRef.id, ...newOrder } }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, error: "Error creating order" }, { status: 500 });
  }
}

export async function GET(req:NextRequest) {  //get all products and 1 product. for all products send userId and for single order send orderId
  try{

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const orderId = url.searchParams.get('orderId');
    if(orderId){
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (!orderSnap.exists()) {
        return null;
      }
      
      const orderData = {
        id: orderSnap.id,
        ...orderSnap.data()
      } as Order;
      return NextResponse.json({
        success: true,
        data:orderData,
        msg:"Successfully fetched orders"
      })
      
  }else{
    const orderRef = collection(db,'orders');
      const orderQuery = query(orderRef,where('userId',"==",userId))   

      const orderSnap = await getDocs(orderQuery);

      const orders:Order[]=[];

      orderSnap.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        } as Order);
      });

      return NextResponse.json({
        success:true,
        data:orders,
        msg:`Fetched all order of the user ${userId} successfully !`

      })

   
  }
  }catch(e){
    return NextResponse.json({
      success:false,
      msg:"Error occured while fetching user order "+e
    })
  }
}


