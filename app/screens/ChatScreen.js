// src/screens/ChatScreen.js
import React, { useState, useCallback, useEffect } from "react";
import { Platform, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import BackButton from "../components/BackButton";

import { fetchAIResponse } from "../core/api";

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const insets = useSafeAreaInsets();

  const tabbarHeight = 50;
  const keyboardVerticalOffset =
    insets.bottom + tabbarHeight + (Platform.OS === "ios" ? 44 : 0);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: { _id: 2, name: "AI", avatar: "https://placeimg.com/140/140/tech" },
      },
    ]);
  }, []);

  const onSend = useCallback(
    async (newMessages = []) => {
      setMessages(prev => GiftedChat.append(prev, newMessages));
      setIsTyping(true);
      const history = [...messages, ...newMessages];
      const aiText = await fetchAIResponse(history);
      const aiMessage = {
        _id: Math.random().toString(36).substring(7),
        text: aiText,
        createdAt: new Date(),
        user: { _id: 2, name: "AI", avatar: "https://placeimg.com/140/140/tech" },
      };

      setMessages(prev => GiftedChat.append(prev, [aiMessage]));
      setIsTyping(false);
    },
    [messages]
  );

  return (
    <Background style={styles.flex}>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Chat</Header>

      <GiftedChat
        messages={messages}
        onSend={msgs => onSend(msgs)}
        user={{ _id: 1 }}
        isTyping={isTyping}
        keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
        containerStyle={styles.chatContainer}
        textInputStyle={styles.textInput}
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  chatContainer: { flex: 1 },
  textInput: { paddingVertical: 10 },
});
