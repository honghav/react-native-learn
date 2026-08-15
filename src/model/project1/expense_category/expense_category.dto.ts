import { AntDesign } from "@expo/vector-icons";

export interface ExpenseCategoryDTO {
    id: string,
    name: string,
    iconName: keyof typeof AntDesign.glyphMap,
    color: string
}