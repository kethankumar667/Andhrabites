# Andhra Bites - Food Ordering Platform

A modern, region-focused food ordering and delivery platform built with a MERN stack, designed for a seamless multi-role experience (Customers, Admins, Restaurant Partners, Delivery Partners).

## 🍛 Project Overview

Andhra Bites brings the authentic flavors of Andhra Pradesh and Telangana to users' fingertips, emphasizing South Indian cuisine, local snacks, and popular street food, while also supporting a scalable framework for pan-India expansion.

## 🏗️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - Database with Mongoose ODM
- **Redis** - Caching and session storage
- **JWT** - Authentication
- **Socket.io** - Real-time communication

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management
- **Framer Motion** - Animations

### Integrations
- **Razorpay** - Payment gateway
- **Google Maps API** - Location services
- **Firebase** - Push notifications
- **Cloudinary** - Image management
- **SendGrid** - Email services
- **Twilio** - SMS services

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Redis server (optional, for caching)
- Google Maps API key
- Razorpay account
- SendGrid account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd andhrabites
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment setup**

   **Backend (.env)**
   ```bash
   cp backend/.env.example backend/.env
   # Fill in your environment variables
   ```

   **Frontend (.env.local)**
   ```bash
   cp frontend/.env.local.example frontend/.env.local
   # Fill in your environment variables
   ```

5. **Start the development servers**

   **Backend**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

   **Frontend**
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:3000
   ```

## 📁 Project Structure

```
andhrabites/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Database and Redis configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Authentication, validation, error handling
│   │   ├── models/            # MongoDB data models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic and external services
│   │   └── types/             # TypeScript type definitions
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # Next.js React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Next.js pages
│   │   ├── store/             # Redux store and slices
│   │   ├── services/          # API services
│   │   ├── styles/            # SCSS and CSS files
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 👥 User Roles

### 🛒 Customers
- Browse and search restaurants by location, cuisine, and preferences
- View detailed menus with customizable items
- Add items to cart with quantity and customization options
- Secure checkout with multiple payment methods
- Real-time order tracking
- Order history and ratings
- Profile and address management

### 🏪 Restaurant Partners
- Restaurant registration and dashboard
- Complete menu management (categories, items, pricing)
- Real-time order processing and status updates
- Analytics and insights (sales, popular items, revenue)
- Offer creation tools
- Performance metrics

### 🚚 Delivery Partners
- Availability toggle and location management
- Order request notifications and acceptance
- GPS-enabled route optimization
- Real-time tracking and delivery updates
- Earnings dashboard and performance metrics
- Customer ratings and feedback

### 👨‍💼 Admins
- Complete system oversight and user management
- Restaurant approval workflow
- Platform analytics and reporting
- Transaction management
- Coupon and promotion creation
- Support ticket handling

## 🔐 Authentication & Security

- **JWT-based authentication** with refresh tokens
- **Role-based access control** (RBAC)
- **Password hashing** with bcrypt
- **Email verification** for account activation
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **CORS configuration** for secure API access

## 📊 Key Features

- **Multi-cuisine support** with focus on Andhra/Telangana specialties
- **Real-time order tracking** with live delivery partner location
- **Smart restaurant recommendations** based on location and preferences
- **Advanced filtering** (cuisine, veg/non-veg, delivery time, ratings)
- **Secure payment integration** with Razorpay
- **Push notifications** for order updates
- **Responsive design** with mobile-first approach
- **Dark/Light theme** support

## 🔧 Development Scripts

### Backend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm test           # Run tests
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript type checking
```

## 🚀 Deployment

### Backend (Render/Heroku/AWS)
1. Build the TypeScript code
2. Set environment variables
3. Deploy to your preferred platform
4. Configure MongoDB Atlas and Redis

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set environment variables
4. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please email support@andhrabites.com or create an issue in the repository.

---

**Built with ❤️ for the food lovers of Andhra Pradesh and Telangana**