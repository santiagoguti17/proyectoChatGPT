// app/index.tsx
import { useRouter } from "expo-router";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function Index() {
  const router = useRouter();
  const { login, user, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirige automáticamente a /chat si ya está autenticado
  useEffect(() => {
    if (!loading && user) {
      router.push("/chat");
    }
  }, [user, loading]);

  const handleLogin = async () => {
    try {
      await login(email, password);
      // La redirección se maneja en el useEffect
    } catch (error) {
      console.log("Error Login:", error);
      alert("Correo electrónico o contraseña incorrectos. Por favor, inténtelo de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/images/chatgptlogo.png")} style={styles.logo} />
      
      {/* Título */}
      <Text style={styles.title}>Bienvenido a ChatGPT</Text>
      
      {/* Contenedor de inputs */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      
      {/* Botón para iniciar sesión */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      
      {/* Botón para registrarse */}
      <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/welcome")}>
        <Text style={styles.linkText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#343541",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 30,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#444",
    color: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#00C17C",
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: "#1E90FF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});