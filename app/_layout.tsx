// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { DataProvider } from "../context/DataContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <DataProvider>
        <Stack>
          <Stack.Screen name="welcome" options={{ title: "Welcome to ChatGPT", headerShown: false }} />
          <Stack.Screen name="chat" options={{ title: "Chat", headerShown: false }} />
          <Stack.Screen name="register" options={{ title: "Register", headerShown: false }} />
          <Stack.Screen name="index" options={{ title: "ChatGPT", headerShown: false }} />
          <Stack.Screen name="home" options={{ title: "Home", headerShown: false }} />
        </Stack>
      </DataProvider>
    </AuthProvider>
  );
}
