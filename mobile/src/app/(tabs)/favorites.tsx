import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";

export default function FavoritesScreen() {
  return (
    <Screen title="Yêu thích">
      <EmptyState
        title="Chưa có hiện vật yêu thích"
        message="Hiện vật bạn yêu thích sẽ xuất hiện tại đây."
      />
    </Screen>
  );
}
