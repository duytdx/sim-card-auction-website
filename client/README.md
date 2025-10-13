<h1 align="center">BidX: Real-Time Auction/Bidding Platform (Frontend)</h1>
<p align="center">
  <a href="https://bid-x.vercel.app">Live Demo</a> &nbsp;&bull;&nbsp;
  <a href="https://bidx.runasp.net/swagger/index.html">Swagger Documentation</a> &nbsp;&bull;&nbsp;
  <a href="https://github.com/Youssef-Adell/BidX-API">Backend Repository</a>
</p>

## 📖 Overview
**BidX** modernizes traditional auction processes by enabling real-time digital bidding through an intuitive, responsive interface. Users can participate in live auctions, place bids, track updates instantly, and interact securely with auction winners or auctioneers—all while receiving immediate notifications for critical actions like bid acceptance or outbidding.  

### Demo Video  
[![Demo Video](https://img.youtube.com/vi/xvVibJIRsc0/maxresdefault.jpg)](https://www.youtube.com/watch?v=xvVibJIRsc0)

## ✨ Key Features 
### **1. Real-Time Bidding**  
- Place and track bids with **live price updates** directly on the auction page.  
- Auctioneers can accept bids in real time, with changes reflected instantly.  

### **2. Real-Time Chat**  
- Chat is **only allowed** between auction winners and the auctioneer.  
- **Features**: Read receipts, user online/offline status, and message history.  

### **3. Real-Time Notifications**  
- **Bidders** notified when their bid is accepted or when they’re outbid.  
- **Auctioneers** notified for new bids on their auctions.  

### **4. Real-Time Auctions Feed**  
- Live updates for new, deleted, or ended auctions, and price changes.  
- Dynamic filtering and search functionality with instant results.  

### **5. Authentication**  
- Email/password, Google authentication, and password recovery.  

### **6. Reviews**  
- Users can leave reviews **only** if they’ve won or created an auction involving the reviewee.  

### **7. Responsive Design**  
- Optimized for all devices (mobile, tablet, desktop) with adaptive layouts.  

### **8. Dark Mode**  
- User-toggleable theme for reduced eye strain in low-light environments.  


## ⚙️ Tech Stack  
- [Vue 3](https://vuejs.org/) - A progressive JavaScript framework for building responsive and dynamic user interfaces.  
- [Vue Router](https://router.vuejs.org/) - Official routing library for Vue.js applications.  
- [Pinia](https://pinia.vuejs.org/) - Intuitive state management library for Vue.js applications.  
- [Vuetify](https://vuetifyjs.com/) - Material Design component library for building polished, accessible UIs.  
- [SignalR Client](https://docs.microsoft.com/en-us/aspnet/core/signalr/) - Library for real-time communication with the backend SignalR hub.  
- [Axios](https://axios-http.com/) - Promise-based HTTP client for API integration.  
- [vue3-google-login](https://devbaji.github.io/vue3-google-login/) - Simplifies Google OAuth integration for Vue 3 applications.  


## 🛠️ Setup & Run 

### 1. Prerequisites  
- [Node.js](https://nodejs.org/) (v20+)  
- [npm](https://www.npmjs.com/) (v10+)  
- Clone the Repository**  
```bash  
git clone https://github.com/Youssef-Adell/BidX-Client.git
cd BidX-Client 
```  

### 2. Configure Environment Variables
   - Rename `.env.example` to `.env`:  
     ```bash  
     cp .env.example .env  
     ```  
   - Update `.env` with your credentials:  
     ```env  
     # Backend API URL  
     VITE_BIDX_API_URL = "https://api.your-domain.com"  
     
     # SignalR Hub URL  
     VITE_BIDX_SIGNALR_URL = "https://api.your-domain.com/hub"  
     
     # Google OAuth Client ID  
     VITE_GOOGLE_CLIENT_ID = "your-google-client-id.apps.googleusercontent.com"  
     ```  

### 3. Install Dependencies  
   ```bash  
   npm install  
   ```  

### 4. Run the Application 
   ```bash  
   npm run dev  
   ```  
   - The frontend will be available at `http://localhost:3000`.  

### 5. Build for Production
   ```bash  
   npm run build  
   npm run preview  
   ```  

> [!NOTE]
> - Before running the frontend, ensure the backend API is set up and running.
> - Follow the [API Setup & Run instructions](https://github.com/Youssef-Adell/BidX-API/?tab=readme-ov-file#%EF%B8%8F-setup--run) for details.  
