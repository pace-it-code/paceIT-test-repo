import { NextResponse } from "next/server";
import { db } from "../../../../utils/firebase";
import { collection, getDocs ,updateDoc,doc} from "firebase/firestore";



export async function GET() {
    try {
      const productsRef = collection(db, "products");
      const querySnapshot = await getDocs(productsRef);
  
      let updatedCount = 0;
  
      // Process each product
      const updatePromises = querySnapshot.docs.map(async (docSnap) => {
        const productData = docSnap.data();
        
        if (productData.name) {
          const searchValue = productData.name.toLowerCase().replace(/\s+/g, ""); // Convert to lowercase & remove spaces
  
          // Check if the search field is missing or incorrect
          if (!productData.search || productData.search !== searchValue) {
            await updateDoc(doc(db, "products", docSnap.id), { search: searchValue });
            updatedCount++;
          }
        }
      });
  
      await Promise.all(updatePromises); // Ensure all updates complete
  
      return NextResponse.json({ 
        success: true, 
        message: `Updated ${updatedCount} products with the 'search' field.` 
      }, { status: 200 });
  
    } catch (error) {
      console.error("Error updating products:", error);
      return NextResponse.json({ success: false, error: "Error updating products" }, { status: 500 });
    }
}