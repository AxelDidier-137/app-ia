import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function App() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    const texto = mensaje;

    setMensajes((prev) => [
      ...prev,
      { id: Date.now().toString(), texto, usuario: true },
    ]);

    setMensaje("");

    try {
      const res = await fetch("https://app-ia-hk22.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: texto,
        }),
      });

      const data = await res.json();

      console.log("RESPUESTA FRONT:", data);

      setMensajes((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          texto: data.reply || "Sin respuesta del servidor",
          usuario: false,
        },
      ]);
    } catch (e) {
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          texto: "Error de conexión",
          usuario: false,
        },
      ]);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.msg,
        item.usuario ? styles.user : styles.ai,
      ]}
    >
      <Text style={{ color: "#fff" }}>{item.texto}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          data={mensajes}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
        />

        <View style={styles.inputBox}>
          <TextInput
            value={mensaje}
            onChangeText={setMensaje}
            placeholder="Escribe..."
            placeholderTextColor="#888"
            style={styles.input}
          />

          <TouchableOpacity
            onPress={enviarMensaje}
            style={styles.btn}
          >
            <Text style={{ color: "#fff" }}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },

  msg: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },

  user: {
    backgroundColor: "#1e90ff",
    alignSelf: "flex-end",
  },

  ai: {
    backgroundColor: "#333",
    alignSelf: "flex-start",
  },

  inputBox: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },

  btn: {
    backgroundColor: "#1e90ff",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 10,
  },
});