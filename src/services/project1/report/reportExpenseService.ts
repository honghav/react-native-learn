
import { reportExpenseData } from "@/model/project1/report/reportExpense.data";
import { ReportExpenseDTO } from "@/model/project1/report/reportExpense.dto";
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
