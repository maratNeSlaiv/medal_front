// src/core/chatService.js
import { fetchAIResponse } from "./api";
import { GiftedChat } from "react-native-gifted-chat";

// Создаём сообщение AI
export function createAIMessage(text) {
  return {
    _id: Math.random().toString(36).substring(7),
    text,
    createdAt: new Date(),
    user: {
      _id: 2,
      name: "AI",
      avatar: "https://placeimg.com/140/140/tech",
    },
  };
}

// Отправка сообщения и получение ответа AI
export async function handleSend(newMessages, messages, setMessages) {
  // Добавляем сообщение пользователя
  setMessages(prev => GiftedChat.append(prev, newMessages));

  // История для AI
  const history = [...messages, ...newMessages];

  // Получаем ответ AI
  const aiResponse = await fetchAIResponse(history);

  // Создаём сообщение AI и добавляем в чат
  const aiMessage = createAIMessage(aiResponse);
  setMessages(prev => GiftedChat.append(prev, [aiMessage]));
}
