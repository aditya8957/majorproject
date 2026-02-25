# 🚀 Project Setup Guide

Follow the steps below to run the project locally.

---

## 📁 1️⃣ Clone the Repository

```bash
git clone https://github.com/aditya8957/majorproject.git
cd majorProject
```

---

## 📦 2️⃣ Install Dependencies

### 🔹 Backend Setup

```bash
cd BackendAdip
npm install
```

### 🔹 Frontend Setup

Open a new terminal:

```bash
cd FrontendAdip
npm install
```

---

## 🔐 3️⃣ Environment Variables Setup

Create `.env` files in both BackendAdip and FrontendAdip folders.

---

### 🔹 BackendAdip `.env`

Create a file named `.env` inside the `BackendAdip` folder and add:

```env
DB_CONNECT_STRING=your_mongodb_connection_string
PORT=4000
JWT_KEY=your_jwt_secret_key
REDIS_PASS=your_redis_password
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

### 🔹 FrontendAdip `.env`

Create a file named `.env` inside the `FrontendAdip` folder and add:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

⚠️ Make sure the Google Client ID is the same in both frontend and backend.

---

## ▶️ 4️⃣ Run the Project

### 🔹 Start Backend Server

```bash
cd BackendAdip
npm run dev
```

Backend will run at:

```
http://localhost:4000
```

---

### 🔹 Start Frontend Server

Open another terminal:

```bash
cd FrontendAdip
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## 🛑 Important Notes

- Make sure MongoDB is running.
- Make sure Redis server is running.
- Do NOT commit `.env` files.
- Add `.env` to `.gitignore`.

