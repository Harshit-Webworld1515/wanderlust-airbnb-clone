# 🌍 Wanderlust — Airbnb Inspired Listing Platform

A full-stack web application inspired by Airbnb that allows users to explore, create, and manage travel listings with authentication, image uploads, maps, and reviews.

---

## 🔗 Live Demo

👉 https://wanderlust-airbnb-2qpt.onrender.com/listings

---

## 🚀 Key Features

* 🔐 Secure Authentication (Signup / Login / Logout)
* 🏡 Full CRUD for Listings
* 📸 Image Upload & Storage (Cloudinary)
* 📍 Location Visualization using Mapbox
* ⭐ Ratings & Reviews System
* 💬 Flash Messaging & Validation
* 🛡️ Session-Based Authentication
* 📱 Responsive UI (Bootstrap)
* 🌐 Deployed on Render

---

## 🛠️ Tech Stack

**Frontend**

* HTML5, CSS3, Bootstrap
* EJS (Templating Engine)

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB Atlas

**Services & Tools**

* Cloudinary (Media Storage)
* Mapbox (Maps & Geocoding)
* Render (Deployment)

---

## 🧱 Architecture

This project follows the **MVC (Model-View-Controller)** pattern:

```id="y7o3a4"
Models      → Database structure (MongoDB)
Views       → UI (EJS Templates)
Controllers → Business logic
Routes      → Request handling
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```id="2v5i2f"
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

MAP_TOKEN=your_mapbox_token

ATLASDB_URL=your_mongodb_connection

SESSION_SECRET=your_secure_secret

PORT=8080
```

---

## 💻 Local Setup

```id="p8k9n1"
git clone https://github.com/your-username/wanderlust.git
cd wanderlust
npm install
npm start
```

Visit → http://localhost:8080


---

## 🧠 What I Learned

* Structuring a full-stack app using MVC
* Handling authentication & sessions
* Integrating third-party APIs (Cloudinary, Mapbox)
* Managing environment variables securely
* Deploying a production-ready app

---


## 🔮 Future Improvements

* 🔍 Advanced Search & Filters
* ❤️ Wishlist / Favorites
* 💳 Payment Integration
* 📊 Admin Dashboard

---

## 📌 Project Status

✅ Completed core features
🚧 Actively improving UI & scalability

---

## 🙌 Acknowledgment

Inspired by Airbnb and built as a learning project.

---
## 📸 Screenshots

🔍 Home Page
<img width="1877" height="1009" alt="image" src="https://github.com/user-attachments/assets/4ad90aea-bbf4-4360-b3b9-a24e34d5cb35" />


📄 Listing Page
<img width="1881" height="1021" alt="image" src="https://github.com/user-attachments/assets/5aeafefd-08a2-40e0-874a-c86bb3a49b26" />


➕ Create Listing
<img width="1881" height="1020" alt="image" src="https://github.com/user-attachments/assets/6fdaf251-3ee1-4f91-a910-7f118a80b435" />


⭐ Reviews & Interaction
<img width="1857" height="1034" alt="image" src="https://github.com/user-attachments/assets/2cd6636d-da60-4357-b04f-5c1a7af35cd5" />


---

## 👨‍💻 Author

**Harshit Pandit**
First Full-Stack Project 🚀
