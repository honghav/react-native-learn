
import { ExpenseItem } from "@/model/project1/expense/expense.dto";
import { reportExpenseData } from "@/model/project1/report/reportExpense.data";
import { AggregatedExpense, ReportExpenseDTO } from "@/model/project1/report/reportExpense.dto";
import { useState } from "react";

export const dateFilter = ['week', 'month', 'year'];

// 1. Helper function declared BEFORE any caller
export const filterDataByRange = (filterType: string): ReportExpenseDTO[] => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const dayOfWeek = now.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    if (filterType === "week") {
        return reportExpenseData.filter((entry) => {
            const entryDate = new Date(`${entry.date}T00:00:00`);
            return entryDate >= startOfWeek && entryDate <= endOfWeek;
        });
    } else if (filterType === "month") {
        return reportExpenseData.filter((entry) => {
            const entryDate = new Date(`${entry.date}T00:00:00`);
            return (
                entryDate.getFullYear() === currentYear &&
                entryDate.getMonth() === currentMonth
            );
        });
    } else if (filterType === "year") {
        return reportExpenseData.filter((entry) => {
            const entryDate = new Date(`${entry.date}T00:00:00`);
            return entryDate.getFullYear() === currentYear;
        });
    }
    return reportExpenseData;
};

export const dateFormated = (date: string, selectedDateFilter: string) => {
    const dateArray = date.split('-');
    const year = dateArray[0];
    const month = dateArray[1];
    const day = dateArray[2];

    if (selectedDateFilter === "week") {
        return day; // Day only (e.g. "11")
    } else if (selectedDateFilter === "month") {
        return `${day}/${month}`; // Day/Month (e.g. "11/08")
    } else if (selectedDateFilter === "year") {
        return `${month}/${year.slice(-2)}`; // Month/2-digit Year (e.g. "08/26")
    }

    return `${day}/${month}/${year}`;
};

const parseExpenseDate = (dateInput: any): Date | null => {
    if (!dateInput) return null;
    if (dateInput instanceof Date) return isNaN(dateInput.getTime()) ? null : dateInput;

    // Handle Firestore Timestamp object ({ seconds: 1786960000 })
    if (typeof dateInput === "object" && typeof dateInput.seconds === "number") {
        return new Date(dateInput.seconds * 1000);
    }

    if (typeof dateInput === "string") {
        const str = dateInput.trim();
        // Handle YYYY-MM-DD format
        const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) {
            const y = parseInt(match[1], 10);
            const m = parseInt(match[2], 10) - 1;
            const d = parseInt(match[3], 10);
            return new Date(y, m, d);
        }
        const parsed = new Date(str);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    if (typeof dateInput === "number") {
        const parsed = new Date(dateInput);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    return null;
};

const parseAmount = (val: any): number => {
    if (typeof val === "number") return isNaN(val) ? 0 : val;
    if (typeof val === "string") {
        const cleaned = val.replace(/[^0-9.]/g, "");
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    }
    return 0;
};

export function getExpensesByFilter(
    expenses: ExpenseItem[],
    dateFilter: 'week' | 'month' | 'year'
): AggregatedExpense[] {
    const now = new Date();

    if (dateFilter === 'year') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const totals = Array(12).fill(0);

        expenses.forEach(item => {
            const d = parseExpenseDate(item.date);
            if (d && d.getFullYear() === now.getFullYear()) {
                totals[d.getMonth()] += parseAmount(item.amount);
            }
        });

        return months.map((label, index) => ({ label, total: totals[index] }));
    }

    if (dateFilter === 'month') {
        const weeks = ['W1', 'W2', 'W3', 'W4'];
        const totals = Array(4).fill(0);

        expenses.forEach(item => {
            const d = parseExpenseDate(item.date);
            if (d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
                const day = d.getDate();
                const weekIndex = Math.min(Math.floor((day - 1) / 7), 3);
                totals[weekIndex] += parseAmount(item.amount);
            }
        });

        return weeks.map((label, index) => ({ label, total: totals[index] }));
    }

    if (dateFilter === 'week') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const totals = Array(7).fill(0);

        // Calculate Monday of current week
        const currentDay = now.getDay();
        const distanceToMonday = (currentDay + 6) % 7;

        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday, 0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        expenses.forEach(item => {
            const d = parseExpenseDate(item.date);
            if (d && d >= startOfWeek && d <= endOfWeek) {
                let dayIndex = d.getDay() - 1;
                if (dayIndex === -1) dayIndex = 6; // Sunday -> 6
                totals[dayIndex] += parseAmount(item.amount);
            }
        });

        return days.map((label, index) => ({ label, total: totals[index] }));
    }

    return [];
}

// 2. Custom Hook to manage React state inside components
export const useReportExpense = () => {
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>(
        dateFilter[0] || ""
    );

    const [filteredData, setFilteredData] = useState<ReportExpenseDTO[]>(() =>
        filterDataByRange(dateFilter[0])
    );

    const hanldeFilterDate = (item: string) => {
        setSelectedDateFilter(item);
        const result = filterDataByRange(item);
        setFilteredData(result);

        console.log(`=== Filter: [${item.toUpperCase()}] ===`);
        console.log("Filtered Results:", result);
    };

    const formatDate = (date: string) => dateFormated(date, selectedDateFilter);

    return {
        selectedDateFilter,
        setSelectedDateFilter,
        filteredData,
        setFilteredData,
        hanldeFilterDate,
        dateFormated: formatDate,
        dateFilter,
    };
};
