import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type DatePickerCalendarProps = {
    selectedDate: string; // Format: "YYYY-MM-DD"
    onSelectDate: (date: string) => void;
};

export default function DatePickerCalendar({
    selectedDate,
    onSelectDate,
}: DatePickerCalendarProps) {
    const initialDate = selectedDate ? new Date(selectedDate) : new Date();
    const [viewDate, setViewDate] = useState(
        isNaN(initialDate.getTime()) ? new Date() : initialDate
    );

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => {
        setViewDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setViewDate(new Date(year, month + 1, 1));
    };

    const handleDayClick = (day: number) => {
        const mm = String(month + 1).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        onSelectDate(`${year}-${mm}-${dd}`);
    };

    // Days grid array
    const daysGrid: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
        daysGrid.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        daysGrid.push(i);
    }

    return (
        <View className="w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mt-3">
            {/* Header: Month Navigation */}
            <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity
                    onPress={prevMonth}
                    className="w-9 h-9 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
                >
                    <AntDesign name="left" size={16} color="#475569" />
                </TouchableOpacity>

                <Text className="text-base font-bold text-slate-800">
                    {MONTH_NAMES[month]} {year}
                </Text>

                <TouchableOpacity
                    onPress={nextMonth}
                    className="w-9 h-9 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
                >
                    <AntDesign name="right" size={16} color="#475569" />
                </TouchableOpacity>
            </View>

            {/* Days of Week Header */}
            <View className="flex-row justify-between mb-2">
                {DAY_NAMES.map((d, idx) => (
                    <View key={idx} className="w-9 items-center justify-center">
                        <Text className="text-xs font-semibold text-slate-400 uppercase">
                            {d}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Calendar Grid */}
            <View className="flex-row flex-wrap justify-between">
                {daysGrid.map((day, idx) => {
                    if (day === null) {
                        return <View key={`empty-${idx}`} className="w-9 h-9 my-1" />;
                    }

                    const mm = String(month + 1).padStart(2, "0");
                    const dd = String(day).padStart(2, "0");
                    const dateStr = `${year}-${mm}-${dd}`;
                    const isSelected = selectedDate === dateStr;

                    return (
                        <TouchableOpacity
                            key={`day-${day}`}
                            onPress={() => handleDayClick(day)}
                            activeOpacity={0.7}
                            className={`w-9 h-9 my-1 rounded-full items-center justify-center ${
                                isSelected ? "bg-blue-600 shadow-sm" : "active:bg-slate-100"
                            }`}
                        >
                            <Text
                                className={`text-sm font-semibold ${
                                    isSelected ? "text-white" : "text-slate-800"
                                }`}
                            >
                                {day}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
