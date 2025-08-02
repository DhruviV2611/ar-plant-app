import { StyleSheet } from "react-native";
import { COLORS } from "./color";

export const commonStyles = StyleSheet.create({
    flex: { flex: 1 },
    errorText:{color:COLORS.ERROR_COLOR},
    placeholderColor: { color: COLORS.PLACEHOLDER_COLOR },
})