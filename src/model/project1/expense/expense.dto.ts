import { AntDesign } from "@expo/vector-icons";
import { ExpenseCategoryDTO } from "../expense_category/expense_category.dto";

export interface ExpenseItem {
    id?: string;
    title: string;
    category: ExpenseCategoryDTO;
    amount: number | string;
    date?: Date;
};

export interface RecentExpensesProps {
    items?: ExpenseItem[];
    // Single item props as fallbacks if no items array is passed
    title?: string;
    category?: ExpenseCategoryDTO;
    amount?: number | string;
    date?: Date;
};