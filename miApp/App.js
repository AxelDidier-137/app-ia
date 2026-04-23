import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";

export default function App() {
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);

  const send = async () => {
    if (!text.trim()) return;

    try {
      const res = await fetch("http://192.168.1.85:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,
          history: history
        })
      });

      const data = await res.json();

      const updated = [
        ...chat,
        { role: "user", content: text },
        { role: "assistant", content: data.reply }
      ];

      setChat(updated);

      setHistory([
        ...history,
        { role: "user", content: text },
        { role: "assistant", content: data.reply }
      ]);

      setText("");

    } catch (e) {
      setChat([
        ...chat,
        { role: "assistant", content: "Error conectando con IA" }
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, padding: 20 }}>

        <ScrollView style={{ flex: 1 }}>
          {chat.map((m, i) => (
            <Text key={i} style={{ marginBottom: 10 }}>
              {m.role === "user" ? "Tú: " : "IA: "}
              {m.content}
            </Text>
          ))}
        </ScrollView>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Escribe aquí..."
          style={{
            borderWidth: 1,
            padding: 10,
            marginBottom: 10,
            borderRadius: 8
          }}
        />

        <TouchableOpacity
          onPress={send}
          style={{
            backgroundColor: "blue",
            padding: 15,
            borderRadius: 10,
            alignItems: "center"
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Enviar
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}