# Chatzy – Language Exchange Platform 🌍💬

Chatzy is a language exchange platform that helps you connect, chat and practice foreign languages ​​with people around the world in real-time.

---

## 📑 Table of Contents

- [Introduction](#introduction)
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [GetStream Integration](#getstream-integration)
- [Contributing](#contributing)
- [License](#license)

---

## 📝 Introduction

**Chatzy** is a modern real-time language exchange platform designed to help users connect, communicate, and practice foreign languages with native speakers worldwide. Built with a cutting-edge technology stack featuring React, TypeScript, and Vite on the frontend, plus Express and Socket.IO on the backend, Chatzy delivers seamless performance and instant interactions.

The platform enables users to discover language partners, exchange messages in real-time, manage friend connections, and receive instant notifications. Our primary goal is to foster a supportive global community for language learning and cultural exchange.

---

## 🖼️ Overview

Chatzy consists of two main components: **Frontend** (React + Vite) and **Backend** (Express + TypeScript). Users can register accounts, create personalized profiles, connect with friends, engage in one-on-one conversations or group chats, receive real-time notifications, and discover language partners based on their target languages.

<img width="1919" height="864" alt="image" src="https://github.com/user-attachments/assets/e919e815-7125-4073-96cf-0260bb0f5453" />

<br/>

 <img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/ae22bc90-8642-43e1-bfd6-d736b017b1ef" /> 
 
<br/>
 
 <img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/25eb6de0-53fd-4f37-b1ba-b0eb74c9f8d6" />

---

## ✨ Features

- 🔐 **User Authentication** - Secure registration/login with profile management
- 💬 **Real-time Chat** - Instant messaging (1-on-1 & group chats) powered by Socket.IO
- 👥 **Friend Management** - Friend lists with send/accept friend requests
- 🔔 **Live Notifications** - Real-time alerts for messages and friend requests
- 🗂️ **Message History** - Conversation management and chat history
- 🔎 **Language Partner Discovery** - Find users by target languages and interests
- 🌐 **Multi-language Support** - Interface available in multiple languages
- 🚀 **Upcoming Features:** Voice/Video calls, AI vocabulary suggestions, Activity dashboard analytics

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library with hooks and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **TypeScript** - Type-safe development experience
- **TailwindCSS** - Utility-first CSS framework for rapid styling

### Backend

- **Express.js** - Fast and minimalist web framework
- **TypeScript** - Type-safe server-side development
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Secure authentication and authorization

### Database & Services

- **Mongo** - You can use Mongo Atlas for easy use
- **GetStream** - Professional chat and activity feeds (see integration guide below)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **Mongo** (Atlas or docker you like)
- **Git** for version control

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/chatzy.git
cd chatzy

# Cài đặt dependencies cho client & server
cd client && npm install
cd ../server && npm install
```

### Run Development

```bash
# Chạy frontend
cd client
npm run dev

# Chạy backend
cd ../server
npm run dev
```

### Run Production

```bash
# Build frontend
cd client
npm run build

# Chạy backend production
cd ../server
npm run start
```

---

## 📜 Available Scripts

**Client:**

- `npm run dev` – Chạy frontend dev server
- `npm run build` – Build production
- `npm run lint` – Kiểm tra code với ESLint
- `npm run preview` – Xem bản build

**Server:**

- `npm run dev` – Chạy backend dev server
- `npm run start` – Chạy backend production
- `npm run lint` – Kiểm tra code với ESLint
- `npm run test` – Chạy unit tests

---

### Run Production

Create environment files for both client and server:

```bash
# Client (.env):
VITE_STREAM_API_KEY=your_getstream_api_key

# Server (.env):
MONGODB_URI=your_mongodb_url

# CDI: openssl rand base64 32
JWT_SECRET_KEY=your_jwt_secret_key

# Stream
STREAM_API_KEY=your_getstream_api_key
STREAM_API_SECRET=your_getstream_api_secret

CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 🗂️ Project Structure

```

chatzy/
├── client/ # Frontend (React + Vite)
│ ├── src/
│ ├── public/
│ └── ...
├── server/ # Backend (Express + TypeScript)
│ ├── src/
│ └── ...
├── README.md
├──package.json
└── ...

```

---

## 🌊 GetStream Integration

Chatzy leverages GetStream for enhanced chat functionality and real-time features.

1. Create GetStream Account

   - Visit [`GetStream Dashboard`](https://dashboard.getstream.io/)
   - Sign up for a free account
   - Create a new application

2. Get API Credentials

- Navigate to your app dashboard
- Copy your API Key and API Secret
- Add them to your environment variables

3. Install GetStream SDK

```bash
# Client-side SDK
cd client
npm install stream-chat stream-chat-react

# Server-side SDK
cd server
npm install stream-chat
```

4. Initialize GetStream Client

```bash
# client/src/services/stream.ts
import { StreamChat } from 'stream-chat';

export const chatClient = StreamChat.getInstance(
  import.meta.env.VITE_GETSTREAM_API_KEY
);

```

5. Server Integration

```bash
# server/src/services/stream.ts
import { StreamChat } from 'stream-chat';

export const serverClient = StreamChat.getInstance(
  process.env.GETSTREAM_API_KEY!,
  process.env.GETSTREAM_API_SECRET!
);

```

For detailed implementation, refer to the ['GetStream Chat Documentation'](https://getstream.io/chat/docs/).

---

## 🤝 Contributing

We welcome contributions from the community

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a feature branch
4. Make your changes and commit them
5. Push to your branch
6. Open a pull request

---

## 📄 License

Distributed under the MIT License.
See [`LICENSE`](./LICENSE) for more information.

---

> Made with ❤️ by the Zanzandora ~
