---
title: Gemini Co-Drawing
emoji: ✏️
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: apache-2.0
app_port: 3000
short_description: 'Gemini 2.0 native image generation co-doodling'
---

🌈 **演示地址 | Demo:** [https://hua.31tu.com/](https://hua.31tu.com/)

# Gemini Co-Drawing | Gemini 协作绘图

[English](#english) | [中文](#chinese)

<a name="english"></a>
## 🎨 Gemini Co-Drawing (English)

A collaborative drawing application powered by Google's Gemini 2.0 API for image generation. This app allows users to create drawings and have Gemini enhance or add to them based on text prompts.

### Features

- Interactive canvas for drawing
- Color picker for customizing your drawings
- Text prompt interface to instruct Gemini on what to add
- Real-time image generation using Gemini 2.0

### Technology Stack

This is a [Next.js](https://nextjs.org) project that uses:
- Next.js for the frontend and API routes
- Google's Gemini 2.0 API for image generation
- Canvas API for drawing functionality

### Gemini API Keys

The application supports two methods for accessing the Gemini API:

1. **Public API Keys**: The app includes built-in public API keys that you can use immediately:
   ```
   AIzaSyDRmxCmACNA0YmYU-50JPaKRVVThmH-NOI
   AIzaSyDRN3NUhzFKc6BqJGV6_mfwEenVSfpHwJY
   AIzaSyBC_6fQ3T5xXGx3Qty5RiXRKCX7qPACPQ0
   AIzaSyAJSuFoxlAG2862kTKf51wnUZMphH2V0sA
   ```

   **Modifying Public Keys**: If you want to modify the public keys, you need to edit the `publicKeys` array in the `pages/index.js` file (around line 25):
   ```javascript
   const publicKeys = [
     "YOUR_NEW_KEY_1",
     "YOUR_NEW_KEY_2",
     "YOUR_NEW_KEY_3",
     "YOUR_NEW_KEY_4"
   ];
   ```

2. **Private API Key**: For better reliability, you can obtain your own API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and enter it in the application.

### Deploying to Vercel

This app can be easily deployed to Vercel:

1. Fork or clone this repository to your GitHub account
2. Connect your GitHub repository to Vercel
3. Deploy the application
4. No environment variables are required as API keys are handled within the application

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcdpath%2Fgemini-codrawing-vercel)

### Getting Started

1. Access the application
2. Choose to use the built-in public API keys or enter your private key
3. Start drawing on the canvas
4. Enter text prompts and let Gemini enhance your drawings
5. Your private API key will be stored in your browser's local storage for future use
6. You can update your API key anytime by clicking the key icon in the toolbar

---

<a name="chinese"></a>
## 🎨 Gemini 协作绘图 (中文)

Gemini 协作绘图是一个由谷歌 Gemini 2.0 API 提供技术支持的协作绘图应用。用户可以创建绘画，并通过文本提示让 Gemini 增强或添加内容。

### 功能特点

- 交互式绘图画布
- 自定义绘画颜色的调色板
- 文本提示界面，指导 Gemini 添加内容
- 使用 Gemini 2.0 进行实时图像生成

### 技术栈

这是一个使用 [Next.js](https://nextjs.org) 的项目，包含：
- 前端和 API 路由使用 Next.js
- 图像生成使用 Google Gemini 2.0 API
- 绘图功能使用 Canvas API

### Gemini API 密钥

应用支持两种访问 Gemini API 的方式：

1. **公共 API 密钥**：应用内置了公共 API 密钥，您可以立即使用：
   ```
   AIzaSyDRmxCmACNA0YmYU-50JPaKRVVThmH-NOI
   AIzaSyDRN3NUhzFKc6BqJGV6_mfwEenVSfpHwJY
   AIzaSyBC_6fQ3T5xXGx3Qty5RiXRKCX7qPACPQ0
   AIzaSyAJSuFoxlAG2862kTKf51wnUZMphH2V0sA
   ```

   **修改公共密钥**：如果您想修改公共密钥，需要编辑 `pages/index.js` 文件中的 `publicKeys` 数组（大约在第25行）：
   ```javascript
   const publicKeys = [
     "您的新密钥_1",
     "您的新密钥_2",
     "您的新密钥_3",
     "您的新密钥_4"
   ];
   ```

2. **私人 API 密钥**：为了更好的可靠性，您可以从 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取自己的 API 密钥并在应用中输入。

### 部署到 Vercel

该应用可以轻松部署到 Vercel：

1. Fork 或克隆此仓库到您的 GitHub 账户
2. 将您的 GitHub 仓库连接到 Vercel
3. 部署应用
4. 不需要环境变量，因为 API 密钥在应用内部处理

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcdpath%2Fgemini-codrawing-vercel)

### 开始使用

1. 访问应用
2. 选择使用内置公共 API 密钥或输入您的私人密钥
3. 在画布上开始绘画
4. 输入文本提示，让 Gemini 增强您的绘画
5. 您的私人 API 密钥将存储在浏览器的本地存储中以供将来使用
6. 您可以随时点击工具栏上的钥匙图标更新您的 API 密钥
