import { Ionicons } from "@expo/vector-icons";

export interface ModuleDTO {
    id: string;
    name: string;
    path: any;
    icon?: keyof typeof Ionicons.glyphMap;
    description?: string;
}


