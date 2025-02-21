"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserId } from "../hooks/useId";

interface Address {
    id?: string;
    line1: string;
    line2?: string;
    state: string;
    city: string;
    zip: string;
    phone: string;
}

export default function AddressPage() {
    const router = useRouter();
    const userId = useUserId();

    // Properly typed address state
    const [address, setAddress] = useState<Address>({
        line1: "",
        line2: "",
        state: "",
        city: "",
        zip: "",
        phone: "",
    });

    // Handle input changes safely with keyof Address
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!userId) return;

        const response = await fetch("/api/address", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, address }),
        });

        const data = await response.json();

        if (data?.message) {
            router.push("/order");
        } else {
            alert("Failed to save address.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-4">🏠 Add Address</h1>
            <div className="space-y-4">
                {(["line1", "line2", "state", "city", "zip", "phone"] as Array<keyof Address>).map(
                    (field) => (
                        <input
                            key={field}
                            type="text"
                            name={field}
                            placeholder={field}
                            value={address[field] ?? ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    )
                )}
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg"
                >
                    📦 Save Address & Proceed
                </button>
            </div>
        </div>
    );
}
