import DatePickerCalendar from "@/components/project1/DatePickerCalendar";
import NavBarProject1 from "@/components/project1/navbar";
import ViewContainer from "@/components/viewContainer";
import { expenseCategoryData } from "@/model/project1/expense_category/expense_category.data";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ExpenseForm() {
    const [amount, setAmount] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
        expenseCategoryData[0]?.id || ""
    );
    // Initialize date to today's date (YYYY-MM-DD)
    const todayStr = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState(todayStr);
    const [showCalendarPicker, setShowCalendarPicker] = useState(false);

    const handleSelectToday = () => {
        setDate(todayStr);
        setShowCalendarPicker(false);
    };

    const handleSelectYesterday = () => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        setDate(d.toISOString().split("T")[0]);
        setShowCalendarPicker(false);
    };

    const handleSave = () => {
        if (!amount || parseFloat(amount) <= 0) {
            alert("Please enter a valid expense amount");
            return;
        }
        // Save action logic here
        router.back();
    };

    return (
        <View className="flex-1 bg-white p-4">
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 space-y-4">
                <NavBarProject1 title="Add Expense" />

                {/* Amount Input Section */}
                <ViewContainer>
                    <View className="w-full my-2 items-center">
                        <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">
                            Enter Amount
                        </Text>

                        <View className="flex-row items-center justify-center bg-white rounded-2xl px-6 py-5 w-full border border-slate-200 shadow-sm">
                            <Text className="text-4xl font-bold text-emerald-600 mr-1">$</Text>
                            <TextInput
                                className="text-4xl font-bold text-slate-900 min-w-[120px] text-center outline-none focus:outline-none focus:border-none"
                                style={{ outlineStyle: 'none' } as any}
                                placeholder="0.00"
                                placeholderTextColor="#94a3b8"
                                keyboardType="decimal-pad"
                                value={amount}
                                onChangeText={setAmount}
                                autoFocus
                            />
                        </View>
                    </View>
                </ViewContainer>

                {/* Category Selection Section */}
                <ViewContainer>
                    <View className="w-full items-start">
                        <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">
                            Category
                        </Text>
                        <View className="flex-row flex-wrap gap-3">
                            {expenseCategoryData.map((category) => {
                                const isSelected = selectedCategoryId === category.id;
                                return (
                                    <TouchableOpacity
                                        key={category.id}
                                        activeOpacity={0.7}
                                        onPress={() => setSelectedCategoryId(category.id)}
                                        className={`h-16 w-16 items-center justify-center rounded-2xl shadow-sm border-2 ${isSelected
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-slate-200 bg-slate-100"
                                            }`}
                                    >
                                        <AntDesign
                                            name={category.iconName}
                                            size={28}
                                            color={isSelected ? "#2563eb" : "#64748b"}
                                        />
                                    </TouchableOpacity>
                                );
                            })}

                            {/* Add New Category Button */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 active:bg-slate-100"
                            >
                                <AntDesign name="plus" size={24} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ViewContainer>

                {/* Date Input Section */}
                <ViewContainer>
                    <View className="w-full items-start">
                        <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">
                            Date
                        </Text>

                        {/* Presets & Toggle Calendar Button */}
                        <View className="flex-row items-center justify-between w-full mb-3">
                            <View className="flex-row gap-2">
                                <TouchableOpacity
                                    onPress={handleSelectToday}
                                    activeOpacity={0.7}
                                    className={`px-3 py-1.5 rounded-full border ${date === todayStr
                                        ? "bg-blue-600 border-blue-600"
                                        : "bg-slate-100 border-slate-200"
                                        }`}
                                >
                                    <Text
                                        className={`text-xs font-semibold ${date === todayStr ? "text-white" : "text-slate-600"
                                            }`}
                                    >
                                        Today
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleSelectYesterday}
                                    activeOpacity={0.7}
                                    className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200"
                                >
                                    <Text className="text-xs font-semibold text-slate-600">
                                        Yesterday
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                onPress={() => setShowCalendarPicker(!showCalendarPicker)}
                                activeOpacity={0.7}
                                className="flex-row items-center px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200"
                            >
                                <AntDesign name="calendar" size={14} color="#2563eb" />
                                <Text className="text-xs font-semibold text-blue-600 ml-1">
                                    {showCalendarPicker ? "Close Calendar" : "Pick Date"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Date Field Box */}
                        <TouchableOpacity
                            onPress={() => setShowCalendarPicker(!showCalendarPicker)}
                            activeOpacity={0.8}
                            className="flex-row items-center bg-white rounded-2xl px-4 py-3.5 w-full border border-slate-200 shadow-sm"
                        >
                            <AntDesign name="calendar" size={22} color="#64748b" />
                            <Text className="flex-1 ml-3 text-slate-900 font-semibold text-base">
                                {date || "Select Date"}
                            </Text>
                            <AntDesign
                                name={showCalendarPicker ? "up" : "down"}
                                size={14}
                                color="#94a3b8"
                            />
                        </TouchableOpacity>

                        {/* Visual Calendar Picker Component */}
                        {showCalendarPicker && (
                            <DatePickerCalendar
                                selectedDate={date}
                                onSelectDate={(selected) => {
                                    setDate(selected);
                                    setShowCalendarPicker(false);
                                }}
                            />
                        )}

                        <View className="w-full py-2 border-2 border-slate-200 my-4 rounded-2xl shadow-sm bg-white " >
                            <TextInput className="h-8 px-4 focus:outline-none focus:border-none" placeholder="Your Objective OF Expense" />
                        </View>
                    </View>

                </ViewContainer>

                {/* Save Expense Button */}
                <TouchableOpacity
                    onPress={handleSave}
                    activeOpacity={0.8}
                    className="w-full bg-blue-600 py-4 rounded-2xl items-center justify-center shadow-md my-4 active:bg-blue-700"
                >
                    <Text className="text-white font-bold text-base">Save Expense</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create({});