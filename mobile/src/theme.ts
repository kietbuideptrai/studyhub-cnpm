import { StyleSheet } from "react-native";

export const colors = {
  background: "#F7F8F4",
  paper: "#FFFFFF",
  ink: "#20312C",
  muted: "#62716A",
  primary: "#176B52",
  border: "#DCE4DE",
  highlight: "#EAF2EC",
  error: "#9B2C2C",
  errorBackground: "#FBEAEA",
} as const;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: colors.background,
  },
  screenContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  screenTitle: {
    marginBottom: 18,
    color: colors.ink,
    fontSize: 28,
    fontWeight: "800",
  },
  bodyText: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 25,
  },
});
