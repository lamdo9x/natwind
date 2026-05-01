import "../global.css";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "@natwind/registry";

import { useColorScheme } from "@/components/useColorScheme";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({});

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ToastProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            <Stack.Screen
              name="component/[name]"
              options={({ route }) => {
                const name = (route.params as any)?.name ?? "";
                const TITLE_MAP: Record<string, string> = {
                  "input-otp": "InputOTP",
                  "alert-dialog": "AlertDialog",
                  "avoid-keyboard": "AvoidKeyboard",
                  "mode-toggle": "ModeToggle",
                  "scroll-view": "ScrollView",
                  "action-sheet": "ActionSheet",
                  "bottom-sheet": "BottomSheet",
                  "date-picker": "DatePicker",
                };
                const title =
                  TITLE_MAP[name] ??
                  name
                    .split("-")
                    .map((w: string) => w[0]?.toUpperCase() + w.slice(1))
                    .join("");
                return { headerBackTitle: "Back", title };
              }}
            />
          </Stack>
        </ToastProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
