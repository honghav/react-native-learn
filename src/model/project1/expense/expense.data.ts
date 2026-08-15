import { expenseCategoryData } from "../expense_category/expense_category.data";
import { ExpenseItem } from "./expense.dto";

export const expenseItemData: ExpenseItem[] = [
    {
        id: "1",
        title: "Car Maintenance & Fuel",
        amount: 100,
        category: expenseCategoryData[0],
    },
    {
        id: "2",
        title: "Dinner & Drinks",
        amount: 45.5,
        category: expenseCategoryData[1],
    },
    {
        id: "3",
        title: "Grocery Shopping",
        amount: 82.3,
        category: expenseCategoryData[0],
    },
    {
        id: "3",
        title: "Grocery Shopping",
        amount: 82.3,
        category: expenseCategoryData[0],
    },
    {
        id: "3",
        title: "Grocery Shopping",
        amount: 82.3,
        category: expenseCategoryData[1],
    },
    {
        id: "3",
        title: "Grocery Shopping",
        amount: 82.3,
        category: expenseCategoryData[1],
    },
];