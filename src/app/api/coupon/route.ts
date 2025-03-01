import { NextResponse } from "next/server";

// In-memory coupon storage (Replace with a DB later)
let activeCoupon: { code: string; discount: number } | null = null;

// ✅ GET request (Fetch Active Coupon)
export async function GET() {
  if (!activeCoupon) {
    return NextResponse.json({ message: "No active coupon", discount: 0 }, { status: 200 });
  }
  return NextResponse.json(activeCoupon, { status: 200 });
}

// ✅ POST request (Apply a New Coupon)
export async function POST(req: Request) {
  try {
    const { code, discount } = await req.json();

    if (!code || typeof discount !== "number") {
      return NextResponse.json({ error: "Invalid coupon code or discount value" }, { status: 400 });
    }

    if (discount > 20) {
      return NextResponse.json({ error: "Discount cannot exceed 20%" }, { status: 400 });
    }

    activeCoupon = { code, discount };
    return NextResponse.json({ message: "Coupon applied successfully", coupon: activeCoupon }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ PUT request (Update Existing Coupon)
export async function PUT(req: Request) {
  try {
    if (!activeCoupon) {
      return NextResponse.json({ error: "No active coupon to update" }, { status: 404 });
    }

    const { code, discount } = await req.json();

    if (!code || typeof discount !== "number") {
      return NextResponse.json({ error: "Invalid coupon code or discount value" }, { status: 400 });
    }

    if (discount > 20) {
      return NextResponse.json({ error: "Discount cannot exceed 20%" }, { status: 400 });
    }

    activeCoupon = { code, discount };
    return NextResponse.json({ message: "Coupon updated successfully", coupon: activeCoupon }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ DELETE request (Remove Active Coupon)
export async function DELETE() {
  activeCoupon = null;
  return NextResponse.json({ message: "Coupon removed" }, { status: 200 });
}
