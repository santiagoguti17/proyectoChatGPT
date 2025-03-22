// app/welcome.tsx

import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated 
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "react-native"; // Puedes usar también "expo-image" si lo prefieres

export default function Welcome() {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Definición de etapas con título, subtítulo y ejemplos de contenido.
  const stages = [
    {
      title: "Welcome to ChatGPT",
      subtitle: "Ask anything. Get your answer.",
      content: [
        "Explain quantum computing in simple terms",
        "Get creative ideas for a 10-year-old's birthday",
        "How do I make an HTTP request in Javascript?",
      ],
    },
    {
      title: "Capabilities",
      subtitle: "What ChatGPT can do for you.",
      content: [
        "Remembers previous conversation context",
        "Allows follow-up corrections",
        "Trained to decline inappropriate requests",
      ],
    },
    {
      title: "Limitations",
      subtitle: "Things to keep in mind.",
      content: [
        "May occasionally generate incorrect information",
        "May produce harmful instructions or biased content",
        "Limited knowledge of events after 2021",
      ],
    },
  ];

  const nextStage = () => {
    if (stage < stages.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setStage(stage + 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Al finalizar, redirige a la pantalla de chat.
      router.push("/register");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo: Asegúrate de tener "chatgptlogo.png" en assets/images */}
      <Image
        source={require("../assets/images/chatgptlogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>{stages[stage].title}</Text>
        <Text style={styles.subtitle}>{stages[stage].subtitle}</Text>
      </Animated.View>

      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        {stages[stage].content.map((text, index) => (
          <View key={index} style={styles.contentBox}>
            <Text style={styles.contentText}>{text}</Text>
          </View>
        ))}
      </Animated.View>

      <View style={styles.stageIndicator}>
        {stages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.stageLine,
              index === stage && styles.activeStageLine,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={nextStage}>
        <Text style={styles.buttonText}>
          {stage < stages.length - 1 ? "Next" : "Let's Chat!"}
        </Text>
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
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 40,
    textAlign: "center",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  contentBox: {
    width: "90%",
    backgroundColor: "#40414f",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  contentText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  stageIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  stageLine: {
    width: 30,
    height: 3,
    backgroundColor: "#555",
    marginHorizontal: 5,
    borderRadius: 2,
  },
  activeStageLine: {
    backgroundColor: "#18a47c",
  },
  button: {
    backgroundColor: "#18a47c",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
