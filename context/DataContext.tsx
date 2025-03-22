import { createContext, useState, useContext } from "react";
import { addDoc, collection, getDocs, updateDoc, doc, query, where, Timestamp, deleteDoc, arrayUnion, getDoc } from "firebase/firestore/";
import { db } from "../utils/firebaseconfig";
import { FirestoreChat, ChatMessage } from "../interfaces/AppInterfaces";
import { AuthContext } from "./AuthContext";

interface DataContextProps {
  chats: FirestoreChat[];
  messages: ChatMessage[];
  chatId: string;
  createChat: (text: string, messages: ChatMessage[]) => Promise<string | undefined>;
  updateChat: (id: string, messages: ChatMessage[]) => Promise<void>;
  getChats: () => Promise<void>;
  getUserChats: (userId: string) => Promise<FirestoreChat[]>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>; 
  deleteAllChats: (userId: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  setChatId: (chatId: string) => void;
  setChats: (chats: FirestoreChat[]) => void;
}

export const DataContext = createContext({} as DataContextProps);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<FirestoreChat[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string>("");
  const { user } = useContext(AuthContext);

  const API_KEY = "AIzaSyAq_ykdT4JByVFup_i6a3Sam-9n0hATIoc";

  const createChat = async (title: string, messages: ChatMessage[]) => {
    try {
      const tempId = Date.now().toString();
  
      const newChat: FirestoreChat = {
        id: tempId,
        title: title, // Título temporal ("New Chat")
        created_at: Timestamp.fromDate(new Date()),
        messages,
        userId: user?.uid,
      };
  
      setChats((prev) => [newChat, ...prev]);
  
      const response = await addDoc(collection(db, "chats"), {
        title: title, // Título temporal ("New Chat")
        created_at: new Date(),
        messages,
        userId: user?.uid,
      });
  
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === tempId ? { ...chat, id: response.id } : chat
        )
      );
  
      return response.id;
    } catch (error) {
      console.error("Error al crear chat:", error);
      throw error;
    }
  };

  const updateChat = async (id: string, messages: ChatMessage[]) => {
    if (!id) {
      console.warn("chatId es null. No se puede actualizar el chat.");
      return;
    }
    try {
      const chatRef = doc(db, "chats", id);
      await updateDoc(chatRef, { messages });
    } catch (error) {
      console.error("Error al actualizar chat:", error);
    }
  };

  const getChats = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "chats"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const newChats = querySnapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id,
      })) as FirestoreChat[];
      setChats(newChats);
    } catch (error) {
      console.error("Error al obtener chats:", error);
    }
  };

  const getUserChats = async (userId: string) => {
    try {
        const q = query(collection(db, "chats"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const userChats: FirestoreChat[] = querySnapshot.docs.map((doc) => ({
            id: doc.id, 
            ...doc.data(), 
        })) as FirestoreChat[];
        return userChats;
    } catch (error) {
        console.error("Error fetching user chats:", error);
        return [];
    }
};

  const updateChatTitle = async (chatId: string, title: string) => {
    try {
        const chatRef = doc(db, "chats", chatId);
        await updateDoc(chatRef, { title });
    } catch (error) {
        console.error("Error updating chat title:", error);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const chatRef = doc(db, "chats", chatId);
      await deleteDoc(chatRef);
  
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const deleteAllChats = async (userId: string) => {
    try {
      const q = query(collection(db, "chats"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
  
      setChats([]);
    } catch (error) {
      console.error("Error deleting all chats:", error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
  
    const userMessage: ChatMessage = {
      text,
      sender: "user",
      date: new Date(),
      state: "received",
    };
  
    let newChatId = chatId;
  
    // Si no hay un chatId, creamos un nuevo chat
    if (!chatId) {
      try {
        newChatId = await createChat("New Chat", [userMessage]); // Título temporal
        if (newChatId) {
          setChatId(newChatId);
          setMessages([userMessage]); // <-- Aquí se actualiza el estado local
        }
      } catch (error) {
        console.error("Error al crear chat:", error);
        return;
      }
    } else {
      // Si ya hay un chatId, actualizamos los mensajes
      setMessages((prev) => [...prev, userMessage]); // <-- Aquí se actualiza el estado local
      await updateChat(chatId, [...messages, userMessage]);
    }
  
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
      const body = { contents: [{ parts: [{ text }] }] };
  
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta";
  
      const botMessage: ChatMessage = {
        text: aiText,
        sender: "bot",
        date: new Date(),
        state: "received",
      };
  
      // Actualizar los mensajes con la respuesta del bot
      setMessages((prev) => [...prev, botMessage]); // <-- Aquí se actualiza el estado local
      await updateChat(newChatId, [...messages, userMessage, botMessage]);
  
      // Actualizar el título solo si es el primer mensaje (chat nuevo)
      if (messages.length === 0) {
        const newTitle = text.split(" ").slice(0, 5).join(" ") || "Chat sin título";
        await updateChatTitle(newChatId, newTitle);
      }
    } catch (error) {
      console.error("Error al obtener respuesta:", error);
      const errorMessage: ChatMessage = {
        text: "Error al obtener respuesta.",
        sender: "bot",
        date: new Date(),
        state: "received",
      };
  
      // Actualizar los mensajes con el mensaje de error
      setMessages((prev) => [...prev, errorMessage]); // <-- Aquí se actualiza el estado local
      await updateChat(newChatId, [...messages, userMessage, errorMessage]);
    }
  };

  const loadMessages = async (chatId: string) => {
    if (!chatId) {
      console.warn("chatId es null. No se pueden cargar los mensajes.");
      return;
    }
    try {
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
      if (chatDoc.exists()) {
        const loadedMessages = chatDoc.data().messages as ChatMessage[];
        setMessages(loadedMessages);
      }
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        chats,
        messages,
        chatId,
        createChat,
        updateChat,
        getChats,
        getUserChats,
        updateChatTitle,
        deleteChat,
        deleteAllChats,
        sendMessage,
        loadMessages,
        setChatId,
        setChats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};