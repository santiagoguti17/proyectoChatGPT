import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Markdown from "react-native-markdown-display";
import { AuthContext } from "../context/AuthContext";
import { DataContext } from "../context/DataContext";

export default function ChatScreen() {
  const [message, setMessage] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const { chats, messages, chatId, createChat, setChats, sendMessage, loadMessages, setChatId, getUserChats, updateChatTitle, deleteChat, deleteAllChats } = useContext(DataContext);

  useEffect(() => {
    if (isSidebarOpen && user) {
      const fetchChats = async () => {
        const userChats = await getUserChats(user.uid);
        console.log("User Chats:", userChats);
        setChats(userChats);
      };
      fetchChats();
    }
  }, [isSidebarOpen, user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
          Debes iniciar sesión para ver el chat.
        </Text>
      </View>
    );
  }

  const handleNewChat = async () => {
    const newChatId = await createChat("New Chat", []);
    if (newChatId) {
      setChatId(newChatId);
      loadMessages(newChatId);
      setIsSidebarOpen(false);
    }
  };

  const handleChatSelect = async (selectedChatId: string) => {
    setChatId(selectedChatId);
    await loadMessages(selectedChatId);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.replace("/home");
    setIsSidebarOpen(false);
  };

  const handleUpdateTitle = async (chatId: string) => {
    Alert.prompt(
      "Actualizar título",
      "Ingresa el nuevo título:",
      async (newTitle) => {
        if (newTitle) {
          await updateChatTitle(chatId, newTitle);
        }
      }
    );
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSidebarOpen}
        onRequestClose={() => setIsSidebarOpen(false)}
      >
        <View style={styles.sidebarContainer}>
          <View style={styles.sidebarContent}>
            <TouchableOpacity style={styles.sidebarButton} onPress={handleNewChat}>
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.sidebarButtonText}>New Chat</Text>
            </TouchableOpacity>

            <FlatList
              data={chats}
              keyExtractor={(item, index) => item.id ?? index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.sidebarButton}
                  onPress={() => handleChatSelect(item.id)}
                >
                  <Ionicons name="chatbubble-outline" size={24} color="white" />
                  <Text style={styles.sidebarButtonText}>{item.title}</Text>
                  <TouchableOpacity onPress={() => handleUpdateTitle(item.id)}>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteChat(item.id)}>
                    <Ionicons name="trash" size={20} color="white" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.sidebarButton} onPress={async () => { await deleteAllChats(user.uid); handleNewChat(); }}>
              <Ionicons name="trash" size={24} color="white" />
              <Text style={styles.sidebarButtonText}>Eliminar todos los chats</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={24} color="white" />
              <Text style={styles.sidebarButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.sidebarOverlay}
            activeOpacity={1}
            onPress={() => setIsSidebarOpen(false)}
          />
        </View>
      </Modal>

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setIsSidebarOpen(true)}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <Image source={require("../assets/images/chatgptlogo.png")} style={styles.logo} />
      </View>

      {!isSidebarOpen && (
        <>
          <FlatList
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.sender === "user" ? styles.userBubble : styles.aiBubble,
                ]}
              >
                {item.sender === "bot" ? (
                  <Markdown style={markdownStyles}>{item.text}</Markdown>
                ) : (
                  <Text style={styles.messageText}>{item.text}</Text>
                )}
              </View>
            )}
            contentContainerStyle={styles.messagesContainer}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe tu mensaje..."
              placeholderTextColor="#888"
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Ionicons name="paper-plane" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#343541",
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  logo: { width: 30, height: 30, resizeMode: "contain" },
  messagesContainer: { paddingVertical: 10 },
  messageBubble: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#00C17C",
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#555",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#222",
    borderRadius: 25,
  },
  input: {
    flex: 1,
    color: "white",
    padding: 10,
  },
  sendButton: {
    backgroundColor: "#00C17C",
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  sidebarContainer: {
    flex: 1,
    flexDirection: "row",
  },
  sidebarContent: {
    width: "60%",
    backgroundColor: "#2d2d2d",
    padding: 20,
    paddingTop: 50,
  },
  sidebarOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebarButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#404040",
    borderRadius: 8,
  },
  sidebarButtonText: {
    color: "white",
    marginLeft: 15,
    fontSize: 16,
  },
});

const markdownStyles = StyleSheet.create({
  body: { color: "white", fontSize: 16 },
  strong: { fontWeight: "bold" },
  em: { fontStyle: "italic" },
  code_inline: {
    backgroundColor: "#1e1e1e",
    color: "#00FF00",
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  blockquote: {
    backgroundColor: "#444",
    borderLeftWidth: 4,
    borderLeftColor: "#00C17C",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});