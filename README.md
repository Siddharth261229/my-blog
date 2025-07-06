# Personal Blog Website with Themes + Music Vibes 

Hey there!   
I’ve created a full-stack personal blog web app where users can register/login, write and edit blog posts, choose fun visual themes (like rain, snow, maple ), and even **listen to music while blogging** through a mini Spotify player embedded into the UI.

---

## Features

 **Authentication**  
- Local login/register with username and password  
- Google OAuth login  
- Theme selection after login  
- Session-based login persistence  

 **Blog Functionality**  
- Create, edit, delete blog posts  
- Rich text editing features (optional)  
- Share posts on Twitter, LinkedIn, WhatsApp  
- Posts are **user-specific** (you only see your own)  

 **Design & Themes**  
- Select your theme:  Rain,  Snow,  Maple  
- Fully responsive design  
- Home button and floating buttons inspired by Google Keep  

 **🎧 Music Integration**  
- I’ve added a mini Spotify player on the landing page  
- It rotates a vinyl disc animation while music plays  
- You can cycle between multiple embedded tracks using ⏪⏩ buttons  
- Music plays seamlessly while you choose your blogging mood

---

##  Tech Stack

- **Backend**: Node.js + Express  
- **Frontend**: EJS templating + HTML + CSS  
- **Database**: PostgreSQL + Sequelize ORM  
- **Authentication**: Passport.js (Local Strategy + Google OAuth)  
- **Styling**: Dancing Script font + CSS animations  
- **Media**: Spotify embedded iframe player

---

##  Screenshots

coming soon ...........

---

##  Project Structure

- ├── models/           # Sequelize models (User, Post) for database interactions
- ├── views/            # EJS templates for rendering dynamic web pages (home, login, register, landing)
- ├── public/           # Static files including stylesheets, images, and other client-side assets
- │   ├── css/
- │   ├── images/
- │   └── vinyl.png
- ├── routes/           # Express route definitions (e.g., authRoutes.js for authentication, blogRoutes.js for blog content)
- ├── app.js            # Main Express application file, handling server setup and middleware
- ├── .env              # Environment variable configuration (Google OAuth keys, database credentials)
- └── README.md         # This README file



