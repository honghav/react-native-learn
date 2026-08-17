import { CreateExpenseCategoryDTO } from "@/model/project1/expense_category/expense_category.dto";
import { handleCreateCategory } from "@/services/project1/categoryService";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Available preset colors for selection
const COLOR_OPTIONS = [
    { name: "Green", value: "#059669" },
    { name: "Blue", value: "#2563eb" },
    { name: "Orange", value: "#ea580c" },
    { name: "Red", value: "#dc2626" },
    { name: "Purple", value: "#7c3aed" },
    { name: "Teal", value: "#0d9488" },
];

// Available preset icons for selection
const ICON_OPTIONS: (keyof typeof AntDesign.glyphMap)[] = [
    "rest",
    "shop",
    "car",
    "book",
    "gift",
    "medicine-box",
];

export default function CategoryExpenseModal({
    close,
    onSuccess,
}: {
    close: (value: boolean) => void;
    onSuccess?: () => void;
}) {
    const [name, setName] = useState("");
    const [selectedColor, setSelectedColor] = useState<string>(COLOR_OPTIONS[0].value);
    const [selectedIcon, setSelectedIcon] = useState<keyof typeof AntDesign.glyphMap>(ICON_OPTIONS[0]);
    const [loading, setLoading] = useState<boolean>(false);
    const handlePressClose = () => {
        close(false);
    };

    const handleCreate = async () => {
        setLoading(true);
        if (!name.trim()) {
            alert("Please enter a category name");
            setLoading(false);
            return;
        }
        const categoryData: CreateExpenseCategoryDTO = {
            name: name.trim(),
            iconName: selectedIcon,
            color: selectedColor,
        };
        try {
            await handleCreateCategory(categoryData);
            if (onSuccess) onSuccess();
            close(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View
            className="flex-1 justify-center items-center bg-black/70 px-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => close(false)}
                className="absolute inset-0 w-full h-full"
            />
            <View className="w-full max-w-sm bg-white px-5 py-5 rounded-3xl shadow-xl border border-slate-100 z-10">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-lg font-bold text-slate-900">Add Category</Text>
                    <TouchableOpacity
                        onPress={handlePressClose}
                        activeOpacity={0.7}
                        className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
                    >
                        <AntDesign name="close" size={18} color="#64748b" />
                    </TouchableOpacity>
                </View>

                {/* Form Container */}
                <View style={styles.formContainer}>
                    {/* Category Name Input */}
                    <View className="w-full">
                        <Text style={styles.labelInput}>Name</Text>
                        <TextInput
                            style={styles.inputFill}
                            placeholder="Category Name"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#94a3b8"
                        />
                    </View>

                    {/* Icon Selection */}
                    <View className="w-full">
                        <Text style={styles.labelInput}>Icon</Text>
                        <View className="flex-row flex-wrap gap-2.5">
                            {ICON_OPTIONS.map((icon) => {
                                const isSelected = selectedIcon === icon;
                                return (
                                    <TouchableOpacity
                                        key={icon}
                                        activeOpacity={0.7}
                                        onPress={() => setSelectedIcon(icon)}
                                        className={`h-10 w-10 items-center justify-center rounded-xl border ${isSelected
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-slate-200 bg-slate-50"
                                            }`}
                                    >
                                        <AntDesign
                                            name={icon}
                                            size={18}
                                            color={isSelected ? "#2563eb" : "#64748b"}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Color Selection Swatches */}
                    <View className="w-full">
                        <Text style={styles.labelInput}>Color</Text>
                        <View className="flex-row flex-wrap gap-3 items-center">
                            {COLOR_OPTIONS.map((color) => {
                                const isSelected = selectedColor === color.value;
                                return (
                                    <TouchableOpacity
                                        key={color.value}
                                        activeOpacity={0.7}

                                        onPress={() => setSelectedColor(color.value)}
                                        style={{
                                            backgroundColor: color.value,
                                            borderWidth: isSelected ? 3 : 0,
                                            borderColor: "#1e293b",
                                        }}
                                        className={`h-9 w-9 rounded-full items-center justify-center ${isSelected ? "scale-110" : ""
                                            }`}
                                    >
                                        {isSelected && (
                                            <AntDesign name="check" size={14} color="#ffffff" />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Submit Button */}
                    <View className="w-full mt-2">
                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={0.8}
                            disabled={loading}
                            onPress={handleCreate}
                        >
                            <Text className="text-white font-semibold text-base">{loading ? "Creating..." : "Create Category"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        width: "100%",
        rowGap: 14,
        paddingTop: 8,
    },
    inputFill: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        width: "100%",
        borderWidth: 1,
        borderColor: "#cbd5e1",
        fontSize: 15,
        color: "#0f172a",
    },
    labelInput: {
        textAlign: "left",
        marginBottom: 6,
        fontSize: 14,
        fontWeight: "600",
        color: "#334155",
    },
    button: {
        backgroundColor: "#1e293b",
        width: "100%",
        borderRadius: 12,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
    },
});

