import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../utils/firebase';
import { collection, addDoc, getDocs,getDoc, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { CartItem } from '../../../../types/types';
import { stat } from 'fs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId, quantity } = body;

    if (!userId || !productId || !quantity) {
      return NextResponse.json({
        success: false,
        error: 'Please provide all required fields'
      }, { status: 400 });
    }

    const cartItem: CartItem = {
      productId,
      quantity: Number(quantity)
    };

    const docRef = await addDoc(collection(db, "carts"), {
      userId,
      ...cartItem,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...cartItem
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({
      success: false,
      error: 'Error adding to cart'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    const cartQuery = query(collection(db, "carts"), where("userId", "==", userId));
    const cartDocs = await getDocs(cartQuery);
    const cartItems = cartDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: cartItems
    });
  } catch (error) {
    console.error('Error getting cart items:', error);
    return NextResponse.json({
      success: false,
      error: 'Error getting cart items'
    }, { status: 500 });
  }
}

export async function PUT(req:NextRequest) {
    try{
        const body = await req.json();
        const {id,newQuantity} = body;

        const cartQuery = doc(db, "carts", id);
        const cartDocsSnap = await getDoc(cartQuery);
        if(!cartDocsSnap.exists()){
            return NextResponse.json({
                success:false,
                error:"Cant find the cart Instance"
            },{status:500})
        }

        await updateDoc(cartQuery,{quantity:newQuantity})

        return NextResponse.json({
            success:true,
            msg:`Successfully update the cart quantity to${newQuantity} `
        })
    }catch(e){
        return NextResponse.json({
            success : false,
            msg:"Internal Server Error"
        },{status:500})
    }
    
}
export async function DELETE(req:NextRequest) {
    try{
        const {id} = await req.json();

        const cartQuery = doc(db, "carts", id);
        const cartDocsSnap = await getDoc(cartQuery);
        if(!cartDocsSnap.exists()){
            return NextResponse.json({
                success:false,
                error:"Cant find the cart Instance"
            },{status:500})
        }

        await deleteDoc(cartQuery)

        return NextResponse.json({
            success:true,
            msg:`Successfully Delete the cart item `
        })
    }catch(e){
        return NextResponse.json({
            success : false,
            msg:"Internal Server Error"
        },{status:500})
    }
    
}