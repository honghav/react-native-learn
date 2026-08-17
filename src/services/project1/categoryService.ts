import { CreateExpenseCategoryDTO, ExpenseCategoryDTO } from "@/model/project1/expense_category/expense_category.dto";
import { createDataFirestore, fetchDataFirestore } from "@/services/firebase";

const tableName = 'categories'

export const handleCreateCategory = async (data: CreateExpenseCategoryDTO) => {
    try {
        const docRef = await createDataFirestore(tableName, data);
        return docRef;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

export const handleGetExpenseCategory = async (): Promise<ExpenseCategoryDTO[]> => {
    try {
        const categories = await fetchDataFirestore(tableName);
        // console.log("Fetched categories count:", categories.length);
        return categories.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data().body,
        }));
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};





