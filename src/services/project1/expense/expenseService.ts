import { CreateExpenseItem, ExpenseItem } from "@/model/project1/expense/expense.dto";
import { MonthlyBudgetDTO } from "@/model/project1/report/reportExpense.dto";
import { createDataFirestore, fetchDataFirestore } from "@/services/firebase";
const tableName = 'expenses'

export const handleCreateExpense = async (data: CreateExpenseItem) => {
    try {
        const docRef = await createDataFirestore(tableName, data);
        console.log("Expense created with ID:", docRef.id);
        return docRef;
    } catch (error) {
        console.error("Error creating expense:", error);
        throw error;
    }
};

export const handleGetExpense = async (): Promise<ExpenseItem[]> => {
    try {
        const expenses = await fetchDataFirestore(tableName);
        return expenses.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data().body,
        }));
    } catch (error) {
        console.error("Error fetching expenses:", error);
        throw error;
    }
};

export const hanldeMonthlyBudget = (data: ExpenseItem[]): MonthlyBudgetDTO => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth(); // 0-indexed (0 = Jan, 7 = Aug, etc.)
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Filter expenses that belong to the current month & year
    const currentMonthExpenses = data.filter((expense) => {
        if (!expense.date) return false;
        const expDate = new Date(expense.date);
        if (isNaN(expDate.getTime())) return false;
        return (
            expDate.getFullYear() === currentYear &&
            expDate.getMonth() === currentMonthIndex
        );
    });

    const monthlyBudget = 250;
    const totalSpend = currentMonthExpenses.reduce((acc, expense) => acc + Number(expense.amount || 0), 0);

    return {
        currentMonth: monthNames[currentMonthIndex],
        monthlyBudget: Number(monthlyBudget.toFixed(2)),
        totalSpend: Number(totalSpend.toFixed(2)),
        remainingBudget: Number((monthlyBudget - totalSpend).toFixed(2)),
        percentage: Number(((totalSpend / monthlyBudget) * 100).toFixed(1)),
    };
};