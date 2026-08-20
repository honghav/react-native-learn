
import { Platform } from "react-native";

export default async function getApi(id: string) {
    try {
        // On Web browser, route through local proxy to bypass CORS restriction
        const baseUrl = Platform.OS === "web"
            ? `http://localhost:3001/v1/payments/${id}`
            : `https://cutluy.com/v1/payments/${id}`;

        const res = await fetch(baseUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ck_live_JAozsomcDQIs_aaemFT4vLh-TUAR8Rwd`,
                "Content-Type": "application/json",
            }
        });

        const data = await res.json();

        if (!res.ok) {
            console.log("Cutluy API Error:", res.status, data);
            throw new Error(data?.message || `HTTP Error ${res.status}`);
        }

        console.log("Cutluy Response:", data);
        return data;
    } catch (error) {
        console.log("Server Error:", error);
        throw error;
    }
}