import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";

export default function App() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const API_URL = "https://app-ia-hk22.onrender.com/chat";

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    const textoUsuario = mensaje;

    setMensajes((prev) => [
      ...prev,
      { id: Date.now().toString(), texto: textoUsuario, usuario: true },
    ]);

    setMensaje("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textoUsuario,
        }),
      });

      const data = await res.json();

      setMensajes((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          texto: data.reply || "Sin respuesta",
          usuario: false,
        },
      ]);
    } catch (error) {
      setMensajes((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          texto: "Error al conectar con el servidor",
          usuario: false,
        },
      ]);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, paddingTop: 60 }}>

      <FlatList
        data={mensajes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={{
              alignSelf: item.usuario ? "flex-end" : "flex-start",
              margin: 5,
              padding: 10,
              backgroundColor: item.usuario ? "#DCF8C6" : "#eee",
              borderRadius: 10,
            }}
          >
            {item.texto}
          </Text>
        )}
      />

      <TextInput
        value={mensaje}
        onChangeText={setMensaje}
        placeholder="Escribe un mensaje..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 10,
          marginTop: 10,
        }}
      />

      <TouchableOpacity
        onPress={enviarMensaje}
        style={{
          backgroundColor: "#007AFF",
          padding: 15,
          borderRadius: 10,
          marginTop: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}