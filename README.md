# AI Chatbot

A simple AI Chatbot application built with **React (Vite)** for the frontend and **FastAPI** for the backend. The application provides a clean chatbot interface where users can send messages and receive AI-generated responses through a FastAPI API.

## Features

* Modern React-based chatbot UI
* FastAPI backend for handling chat requests
* REST API integration between frontend and backend
* Responsive and user-friendly interface
* Easy environment variable configuration for API keys

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* FastAPI
* Python
* Uvicorn

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vishavanish/AI-CHATBOT.git
cd AI-CHATBOT
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory and add your API key:

```env
API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual AI service API key.

---

## Backend Setup (FastAPI)

Navigate to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux/macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://localhost:8000
```

---

## Frontend Setup (React + Vite)

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

---

## Project Structure

```text
AI-CHATBOT/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── ChatAPI/
│   ├── simple_chatbot_api.py
│   ├── requirements.txt
│   └── .env -- create you own
│
└── README.md
```

---

## API Endpoint

### Chat Endpoint

```http
POST /chat
```

#### Request

```json
{
  "message": "Hello"
}
```

#### Response

```json
{
  "response": "Hi! How can I help you?"
}
```

---

## Running the Application

1. Start the FastAPI backend.
2. Start the React frontend.
3. Open the frontend URL in your browser.
4. Begin chatting with the AI assistant.

---

## Future Improvements

* Chat history In-Memory
* Streaming AI responses

## License
Created by Avanish 
