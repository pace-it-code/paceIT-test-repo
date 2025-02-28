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

// Helper function to check for missing required fields
function findMissingFields(address: Partial<Address>): string[] {
    const requiredFields: (keyof Address)[] = ["line1", "state", "city", "zip", "phone"];
    return requiredFields.filter(field => !address[field]?.trim());
}

// Helper function to normalize addresses (trims and converts to lowercase)
function normalizeAddress(address: Address) {
    return {
        ...address,
        line1: address.line1.trim().toLowerCase(),
        city: address.city.trim().toLowerCase(),
        state: address.state.trim().toLowerCase(),
        zip: address.zip.trim(),
        phone: address.phone.trim(),
    };
}

// **PUT - Add Address**
export async function PUT(req: Request): Promise<NextResponse> {
    try {
        const { userId, address }: { userId: string; address: Address } = await req.json();

        if (!userId || !address) {
            return NextResponse.json({ error: "Missing userId or address" }, { status: 400 });
        }

        // Validate required fields
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
        const existingAddresses: Address[] = Array.isArray(userData?.address) ? userData.address : [];

        // Normalize the new address
        const newAddress = normalizeAddress({ ...address, id: crypto.randomUUID() });

        // Check for duplicate address
        const addressExists = existingAddresses.some(addr => {
            const existingAddr = normalizeAddress(addr);
            return (
                existingAddr.line1 === newAddress.line1 &&
                existingAddr.city === newAddress.city &&
                existingAddr.state === newAddress.state &&
                existingAddr.zip === newAddress.zip &&
                existingAddr.phone === newAddress.phone
            );
        });

        if (addressExists) {
            return NextResponse.json({ message: "Address already exists" }, { status: 400 });
        }

        // **Prepend the new address to ensure it's the first element**
        const updatedAddresses = [newAddress, ...existingAddresses];

        // Update Firestore
        await updateDoc(userRef, { address: updatedAddresses });

        return NextResponse.json({ message: "Address added successfully", data: updatedAddresses }, { status: 200 });
    } catch (error) {
        console.error("Error adding address:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// **GET - Fetch Addresses**
export async function GET(req: NextRequest) {
    try {
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

        return NextResponse.json({
            success: addresses.length > 0,
            data: addresses,
            msg: addresses.length > 0 ? "Address found!" : "No address found for this user",
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching address:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
