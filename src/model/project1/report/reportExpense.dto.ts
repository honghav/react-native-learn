export interface ReportExpenseDTO {
    date: string,
    amount: number,
    description: string,
}

export interface MonthlyBudgetDTO {
    currentMonth: string;
    monthlyBudget: number,
    totalSpend: number,
    remainingBudget: number,
    percentage: number,
}
export interface AggregatedExpense {
    label: string;
    total: number;
}