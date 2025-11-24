# Medal Mobile App

Mobile frontend for Medal, built with Expo and React Native (iOS & Android).

## ⚡ Features

- User authentication (signup/login)  
- Display workout plans, diet, and health tips  
- Upload and view lab results  
- Optimized for mobile devices  

## 🛠 Tech Stack

Expo | React Native | React Navigation | React Native Paper | Axios

## 🚀 Installation

```bash
git clone https://github.com/maratNeSlaiv/medal_front.git
cd medal_front
npm install
expo start
```

## Connecting to the Backend
The API base URL is defined in:
```
app/core/api.js
```
```
const BASE_URL = "http://127.0.0.1:8000";
```
You can replace this value with the address of your backend
In your local enviroment for example:
http://127.0.0.1:8000
