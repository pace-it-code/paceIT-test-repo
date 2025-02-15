import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../utils/firebase';
import { collection, addDoc, getDocs,getDoc,deleteDoc, query, where, updateDoc, doc } from 'firebase/firestore';
import { Order, Product } from '../../../../types/types';
import { CartItem } from '../../../../types/types';

export async function POST(request:NextRequest) {
    try {
      const body = await request.json();
      const { userId } = body;
  
      if (!userId) {
        return NextResponse.json({
          success: false,
          error: "User ID is required",
        }, { status: 400 });
      }
  
      // Fetch all cart items for the user
      const cartQuery = query(collection(db, "carts"), where("userId", "==", userId));
      const cartDocs = await getDocs(cartQuery);
      const items: CartItem[] = cartDocs.docs.map(doc => {
        const data = doc.data() as CartItem; 
        return {
          id: doc.id,
          ...data, 
        };
      });
      console.log(items);
      if (items.length === 0) {
        return NextResponse.json({
          success: false,
          error: "Cart is empty",
        }, { status: 400 });
      }
      let total = 0;
      
      items.map((item)=>{
        total += item.price*item.quantity
      })
  
      // Create the order
      const order = {
        userId,
        items,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
  
      const docRef = await addDoc(collection(db, "orders"), order);
  
      //Delete cart items after order creation
      for (const cartItem of cartDocs.docs) {
        await deleteDoc(doc(db, "carts", cartItem.id));
      }
  
      return NextResponse.json({
        success: true,
        data: {
          id: docRef.id,
          ...order,
        },
      }, { status: 201 });
    
    } catch (error) {
      console.error("Error creating order:", error);
      return NextResponse.json({
        success: false,
        error: "Error creating order",
      }, { status: 500 });
    }
  }
  