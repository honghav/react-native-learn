import DatePickerCalendar from "@/components/project1/DatePickerCalendar";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ExpenseForm() {
    const [amount, setAmount] = useState("45.00");
    const [selectedCategory, setSelectedCategory] = useState("food");
    const [date, setDate] = useState("10 / 24 / 2023");
    const [notes, setNotes] = useState("Lunch at the cafe");
    const [showCalendarPicker, setShowCalendarPicker] = useState(false);

    const categories = [
        { id: "food", name: "Food", iconName: "rest" as const },
        { id: "transport", name: "Transport", iconName: "car" as const },
        { id: "shopping", name: "Shopping", iconName: "shoppingcart" as const },
        { id: "more", name: "More", iconName: "plus" as const },
    ];

    const handleSave = () => {
        if (!amount || parseFloat(amount) <= 0) {
            alert("Please enter a valid expense amount");
            return;
        }
        router.back();
    };

    return (
        <View className="flex-1 bg-slate-50 p-4">
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 space-y-4">
                {/* Header Navbar */}
                <View className="flex-row items-center justify-between py-2 mb-2">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-full active:bg-slate-200"
                    >
                        <AntDesign name="arrowleft" size={20} color="#0f766e" />
                    </TouchableOpacity>

                    <Text className="text-teal-800 font-bold text-lg flex-1 text-center mr-10">
                        Add Expense
                    </Text>
                </View>

                {/* Amount Input Card */}
                <View className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 items-center justify-center my-2">
                    <Text className="text-slate-500 font-medium text-xs text-center mb-3">
                        Enter Amount
                    </Text>

                    <View className="flex-row items-center justify-center">
                        <Text className="text-3xl font-extrabold text-emerald-500 mr-2">$</Text>
                        <TextInput
                            className="text-4xl font-extrabold text-slate-900 min-w-[120px] text-center outline-none focus:outline-none focus:border-none"
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

                {/* Main Form Details Card */}
                <View className="w-full bg-white rounded-3xl p-5 shadow-sm border border-slate-100 my-2 space-y-5">
                    {/* Category Selector */}
                    <View className="w-full">
                        <Text className="text-slate-600 font-semibold text-xs mb-3">
                            Category
                        </Text>

                        <View className="flex-row justify-between items-center w-full">
                            {categories.map((cat) => {
                                const isSelected = selectedCategory === cat.id;
                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        activeOpacity={0.8}
                                        onPress={() => setSelectedCategory(cat.id)}
                                        className={`w-[72px] h-[72px] rounded-2xl items-center justify-center p-2 ${
                                            isSelected
                                                ? "bg-rose-400 shadow-sm"
                                                : "bg-blue-50/80"
                                        }`}
                                    >
                                        <AntDesign
                                            name={cat.iconName}
                                            size={22}
                                            color={isSelected ? "#ffffff" : "#475569"}
                                        />
                                        <Text
                                            className={`text-[11px] font-semibold mt-1.5 ${
                                                isSelected ? "text-white" : "text-slate-600"
                                            }`}
                                            numberOfLines={1}
                                        >
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Date Selector */}
                    <View className="w-full mt-4">
                        <Text className="text-slate-600 font-semibold text-xs mb-2">
                            Date
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setShowCalendarPicker(!showCalendarPicker)}
                            className="flex-row items-center justify-between bg-blue-50/50 rounded-2xl px-4 py-3.5 border border-slate-100"
                        >
                            <View className="flex-row items-center">
                                <AntDesign name="calendar" size={18} color="#475569" />
                                <Text className="text-slate-800 font-semibold text-sm ml-3">
                                    {date}
                                </Text>
                            </View>
                            <AntDesign name="calendar" size={14} color="#94a3b8" />
                        </TouchableOpacity>

                        {/* Calendar Picker Modal / Inline View */}
                        {showCalendarPicker && (
                            <DatePickerCalendar
                                selectedDate={date.replace(/\s+/g, "").replace(/\//g, "-")}
                                onSelectDate={(formatted) => {
                                    const parts = formatted.split("-");
                                    if (parts.length === 3) {
                                        setDate(`${parts[1]} / ${parts[2]} / ${parts[0]}`);
                                    } else {
                                        setDate(formatted);
                                    }
                                    setShowCalendarPicker(false);
                                }}
                            />
                        )}
                    </View>

                    {/* Notes Field */}
                    <View className="w-full mt-4">
                        <Text className="text-slate-600 font-semibold text-xs mb-2">
                            Notes
                        </Text>

                        <View className="flex-row items-center bg-blue-50/50 rounded-2xl px-4 py-3.5 border border-slate-100 min-h-[52px]">
                            <AntDesign name="edit" size={18} color="#475569" />
                            <TextInput
                                className="flex-1 ml-3 text-slate-800 font-medium text-sm outline-none focus:outline-none focus:border-none"
                                style={{ outlineStyle: 'none' } as any}
                                placeholder="Add notes..."
                                placeholderTextColor="#94a3b8"
                                value={notes}
                                onChangeText={setNotes}
                            />
                        </View>
                    </View>
                </View>

                {/* Save Expense Button */}
                <TouchableOpacity
                    onPress={handleSave}
                    activeOpacity={0.85}
                    className="w-full bg-emerald-500 py-4 rounded-full flex-row items-center justify-center shadow-lg active:bg-emerald-600 my-4"
                >
                    <AntDesign name="checkcircle" size={18} color="white" />
                    <Text className="text-white font-bold text-base ml-2">Save Expense</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create({});