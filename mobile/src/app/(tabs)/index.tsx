import { Text } from "react-native";
import { Screen } from "@/components/Screen";
import { styles } from "@/theme";

export default function HomeScreen() {
  return (
    <Screen title="Trang chủ">
      <Text style={styles.bodyText}>
        Khám phá hiện vật và nghe những câu chuyện lịch sử.
      </Text>
    </Screen>
  );
}
