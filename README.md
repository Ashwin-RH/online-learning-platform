# 📚 Online Learning Platform

A full-stack web application that allows users to learn through interactive courses, quizzes, and video lessons. The platform supports role-based access for **Admins**, **Instructors**, and **Students**, ensuring a smooth and scalable learning experience.

---

## 🚀 Features

### 👤 Authentication & User Roles
- JWT-based secure authentication  
- Roles: **Admin**, **Instructor**, **Student**  
- Profile editing & password update  

### 🎓 Courses
- Create, update, and delete courses  
- Upload videos, PDFs, and materials  
- Categorized browsing  
- Student enrollment system  
- Progress tracking per course  

### 📝 Quizzes & Assessments
- Instructors can create quizzes for each course  
- Multiple-choice questions  
- Auto-grading  
- Score and solution review for students  

### 📊 Dashboard
- Personalized dashboard for students  
- Course progress indicators  
- Recent learning activity  
- Quiz performance overview  

### 🧑‍💼 Admin Panel
- Manage all users  
- Approve/remove instructors  
- Monitor platform activity  

### 🎥 Video Learning
- Smooth streaming  
- Large file upload support  

---

## 🛠️ Tech Stack

### Frontend
- React.js  
- TailwindCSS / Material UI  
- Axios  
- React Router  

### Backend
- Node.js  
- Express.js  
- Multer (file uploads)  
- JWT Authentication  

### Database
- MongoDB + Mongoose  

### Deployment
- Frontend: Vercel / Netlify  
- Backend: Render / Railway  
- Storage: Cloudinary / AWS S3  

---

## 📁 Folder Structure
```
online-learning-platform/
│
├── client/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── server/               # Node/Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── .env.example
├── README.md
└── package.json

```
---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/online-learning-platform.git
cd online-learning-platform
```

### 2️⃣ Install Dependencies
```
Backend
cd server
npm install

Frontend
cd ../client
npm install
```

### 3️⃣ Add Environment Variables

#### Create server/.env (use .env.example as reference):
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_KEY=xxx
CLOUDINARY_SECRET=xxx
CLOUDINARY_NAME=xxx
```

### 4️⃣ Run the App
#### Backend
```
cd backend
npm run dev
```
#### Frontend
```
cd frontend
npm start
```

### 🧪 API Endpoints (Summary)
#### Auth
```
POST /auth/register
POST /auth/login
PUT  /auth/change-password
```

#### Courses
```
GET    /courses
POST   /courses
PUT    /courses/:id
DELETE /courses/:id
```
#### Quiz
```
POST /quiz/:courseId
GET  /quiz/:courseId
POST /quiz/submit/:courseId
```

### 📦 Future Enhancements

- AI-based course recommendations
- WebRTC live classes
- Discussion forums
- Certificates after completion
- Payment gateway integration
