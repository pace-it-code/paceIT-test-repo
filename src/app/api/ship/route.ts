import axios from "axios";
import { db } from "../../../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

const SHIPROCKET_API_BASE = "https://apiv2.shiprocket.in/v1/external";

// POST method to handle Shiprocket order creation
export async function POST(request: Request) {
    console.log("API call initiated: /api/ship");

    try {
        const body = await request.json();
        const { userId } = body;

        console.log("Received Request Body:", body);

        if (!userId) {
            console.error("User ID is missing in the request.");
            return NextResponse.json(
                { success: false, error: "User ID is required" },
                { status: 400 }
            );
        }

        // Fetch user data from Firebase
        console.log(`Fetching user data for userId: ${userId}`);
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.error(`User not found for userId: ${userId}`);
            return NextResponse.json(
                { success: false, error: "User not found." },
                { status: 404 }
            );
        }

        const userData = userSnap.data();
        const addresses = userData?.address || [];
        const cartItems = userData?.cart || [];

        console.log("Fetched Addresses:", addresses);
        console.log("Fetched Cart Items:", cartItems);

        // Automatically fetch the first available address
        const address = addresses.length > 0 ? addresses[0] : null;

        if (!address) {
            console.error("No valid address found for the user.");
            return NextResponse.json(
                { success: false, error: "No valid address found." },
                { status: 400 }
            );
        }

        if (cartItems.length === 0) {
            console.error("The cart is empty for the user.");
            return NextResponse.json(
                { success: false, error: "Cart is empty." },
                { status: 400 }
            );
        }

        // Shiprocket token from your environment or provided directly
        const token = process.env.SHIPROCKET_API_TOKEN;

        if (!token) {
            console.error("Shiprocket API token is missing.");
            return NextResponse.json(
                { success: false, error: "Shiprocket API token is not configured." },
                { status: 500 }
            );
        }

        console.log("Shiprocket API Token acquired.");

        // Prepare the order data for Shiprocket
        const orderItems = cartItems.map((item: any) => ({
            name: item.name,
            sku: item.productId || "SKU123",
            units: parseInt(item.quantity, 10),
            selling_price: parseFloat(item.price) || 0,
            discount: 0,
            tax: 0,
            hsn: 44122
        }));

        const orderData = {
            order_id: `ORDER_${userId}_${Date.now()}`,
            order_date: new Date().toISOString().slice(0, 10),
            pickup_location: "home", // Valid pickup location
            billing_customer_name: "John Doe",
            billing_last_name: "Doe",
            billing_address: address.line1,
            billing_address_2: address.line2 || "",
            billing_city: address.city,
            billing_pincode: parseInt(address.zip, 10),
            billing_state: address.state,
            billing_country: "India",
            billing_email: "customer@example.com",
            billing_phone: parseInt(address.phone, 10),
            shipping_is_billing: true,
            order_items: orderItems,
            payment_method: "Prepaid",
            shipping_charges: 0,
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: 0,
            sub_total: cartItems.reduce((acc: number, item: any) => acc + parseFloat(item.price) * item.quantity, 0),
            length: 10.0,
            breadth: 15.0,
            height: 20.0,
            weight: 1.0
        };

        console.log("Prepared Order Data:", JSON.stringify(orderData, null, 2));

        // Create the order in Shiprocket
        const response = await axios.post(
            `${SHIPROCKET_API_BASE}/orders/create/adhoc`,
            orderData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Shiprocket API Response:", response.data);

        return NextResponse.json({ success: true, data: response.data });
    } catch (error: any) {
        console.error("Shiprocket Order Error:", error.message);
        if (error.response) {
            console.error("Error Response Data:", error.response.data);
            return NextResponse.json(
                { success: false, error: error.response.data.message || "Failed to create Shiprocket order." },
                { status: error.response.status }
            );
        }
        return NextResponse.json(
            { success: false, error: "Failed to create Shiprocket order." },
            { status: 500 }
        );
    }
}

// GET method to handle unsupported requests
export async function GET() {
    return NextResponse.json({ success: false, error: "GET method not allowed" }, { status: 405 });
}
