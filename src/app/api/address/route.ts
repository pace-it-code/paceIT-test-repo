import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../utils/firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface Address {
    id: string;
    line1: string;
    line2?: string;
    state: string;
    city: string;
    zip: string;
    phone: string;
}

function findMissingFields(address: Partial<Address>): string[] {
    const requiredFields: (keyof Address)[] = ["line1", "state", "city", "zip", "phone"];
    return requiredFields.filter(field => !address[field]);
}

export async function PUT(req: Request): Promise<NextResponse> {
    try {
        const { userId, address }: { userId: string; address: Address } = await req.json();

        if (!userId || !address) {
            return NextResponse.json({ error: "Missing userId or address" }, { status: 400 });
        }

        const missingFields = findMissingFields(address);
        if (missingFields.length > 0) {
            return NextResponse.json({ error: `Missing address fields: ${missingFields.join(", ")}` }, { status: 400 });
        }

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userData = userSnap.data();
        
        // Ensure existingAddresses is always an array
        const existingAddresses = Array.isArray(userData?.address) ? userData.address : [];

        // Generate a unique ID for the new address
        const newAddress = { ...address, id: crypto.randomUUID() };

        // Append the new address to the existing array
        const updatedAddresses = [...existingAddresses, newAddress];

        await updateDoc(userRef, { address: updatedAddresses });

        return NextResponse.json({ message: "Address added successfully", data: updatedAddresses }, { status: 200 });
    } catch (error) {
        console.error("Error adding address:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    const addresses: Address[] = userData?.address || [];

    if (addresses.length === 0) {
        return NextResponse.json({ success: false, msg: "No address found for this user" }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: addresses, msg: "Address found!" }, { status: 200 });
}
