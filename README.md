# NewsGPT - AI-Powered News Summarizer

A full-stack web application that allows users to create, manage, and summarize news articles using AI. Features user authentication, article management, AI-powered summarization, and admin dashboard.

## 🚀 Features

### Core Functionality

- **User Authentication**: JWT-based authentication with HTTP-only cookies
- **Article Management**: Create, read, update, delete news articles
- **AI Summarization**: Generate summaries using Hugging Face BART model
- **Admin Dashboard**: Comprehensive admin panel for content management
- **Caching**: Redis-based caching for improved performance
- **Responsive Design**: Modern UI built with React and Material-UI

### User Features

- Register and login with email/password
- Create and manage personal articles
- Generate AI summaries of text content
- View article and summary history
- Profile management

### Admin Features

- View system statistics (users, articles, summaries)
- Manage all articles and summaries
- Delete inappropriate content
- User management capabilities

## 🛠 Technology Stack

### Backend

- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Caching**: Redis for performance optimization
- **AI Integration**: Hugging Face Inference API
- **Validation**: Server-side input validation
- **CORS**: Configured for cross-origin requests

### Frontend

- **Framework**: React 19 with Vite
- **Routing**: React Router DOM v7
- **UI Library**: Material-UI (MUI) components
- **Styling**: Tailwind CSS + Custom CSS
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Toastify

### DevOps & Deployment

- **Containerization**: Docker & Docker Compose
- **Frontend Deployment**: Vercel
- **Backend Deployment**: Render (or similar)
- **Environment Management**: dotenv
- **Testing**: Mocha with Chai and Supertest

## 📁 Project Structure

```
newsGPT/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── admin_controller.js     # Admin operations
│   │   │   ├── article_controller.js   # Article CRUD operations
│   │   │   ├── auth_controller.js      # Authentication logic
│   │   │   └── summary_controller.js   # Summary generation
│   │   ├── middleware/
│   │   │   ├── admin_middleware.js     # Admin access control
│   │   │   └── auth_middleware.js      # JWT authentication
│   │   ├── models/
│   │   │   ├── article.js              # Article schema
│   │   │   ├── summary.js              # Summary schema
│   │   │   └── user.js                 # User schema
│   │   └── routes/
│   │       ├── admin_route.js          # Admin API routes
│   │       ├── article_route.js        # Article API routes
│   │       ├── auth_route.js           # Authentication routes
│   │       └── summary_route.js        # Summary API routes
│   ├── test/
│   │   ├── auth_test.js                # Authentication tests
│   │   ├── article_test.js             # Article tests
│   │   └── summary_test.js             # Summary tests
│   ├── .env                            # Environment variables
│   ├── app.js                          # Express app configuration
│   ├── server.js                       # Server entry point
│   ├── redisClient.js                  # Redis connection
│   ├── package.json                    # Backend dependencies
│   └── Dockerfile                      # Backend containerization
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js                # HTTP client configuration
│   │   ├── components/
│   │   │   ├── AdminRoute.jsx          # Admin route protection
│   │   │   ├── Footer.jsx              # Site footer
│   │   │   ├── Navbar.jsx              # Navigation bar
│   │   │   └── ProtectedRoute.jsx      # Auth route protection
│   │   ├── context/
│   │   │   └── AuthProvider.jsx        # Authentication context
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx      # Admin management interface
│   │   │   ├── Auth.jsx                # Login/Register forms
│   │   │   ├── CreateArticle.jsx       # Article creation
│   │   │   ├── EditArticle.jsx         # Article editing
│   │   │   ├── GenerateSummary.jsx     # AI summary generation
│   │   │   ├── History.jsx             # User activity history
│   │   │   ├── Home.jsx                # Landing page
│   │   │   ├── MyArticles.jsx          # User's articles
│   │   │   ├── ProfilePage.jsx         # User profile
│   │   │   ├── ViewArticle.jsx         # Article viewer
│   │   │   └── ViewSummary.jsx         # Summary viewer
│   │   ├── utils/
│   │   │   ├── Loader.jsx              # Loading spinner
│   │   │   ├── Menu.jsx                # Dropdown menu
│   │   │   ├── Toast.js                # Notification system
│   │   │   └── TypeWriter.jsx          # Animated text effect
│   │   ├── App.jsx                     # Main app component
│   │   ├── App.css                     # Global styles
│   │   ├── index.css                   # Base styles
│   │   └── main.jsx                    # App entry point
│   ├── public/
│   │   └── vite.svg                    # Vite logo
│   ├── .env                            # Frontend environment
│   ├── vercel.json                     # Vercel deployment config
│   ├── package.json                    # Frontend dependencies
│   ├── vite.config.js                  # Vite configuration
│   └── Dockerfile                      # Frontend containerization
├── docker-compose.yml                  # Multi-service orchestration
└── README.md                           # This documentation
```

## 🔗 API Documentation

### Authentication Routes (`/api/auth`)

- `POST /signup` - User registration
- `POST /login` - User authentication
- `POST /logout` - User logout
- `GET /me` - Get current user info
- `POST /refresh` - Refresh access token

### Article Routes (`/api/article`)

- `GET /` - Get all articles (public)
- `POST /` - Create new article (authenticated)
- `GET /user/:userId` - Get user's articles (authenticated)
- `GET /:id` - Get specific article
- `PUT /:id` - Update article (owner only)
- `DELETE /:id` - Delete article (owner only)

### Summary Routes (`/api/summary`)

- `GET /` - Get all summaries (public)
- `POST /` - Generate new summary (authenticated)
- `GET /user/:userId` - Get user's summaries (authenticated)
- `GET /:id` - Get specific summary
- `DELETE /:id` - Delete summary (owner only)

### Admin Routes (`/api/admin`)

- `POST /make-admin/:userId` - Promote user to admin
- `GET /stats` - Get system statistics (admin only)
- `GET /articles` - Get all articles (admin only)
- `GET /summaries` - Get all summaries (admin only)
- `DELETE /article/:id` - Delete any article (admin only)
- `DELETE /summary/:id` - Delete any summary (admin only)

## 🗄 Database Models

### User Model

```javascript
{
  username: String (required, unique, 3-20 chars),
  email: String (required, unique, valid email),
  password: String (required, hashed),
  isAdmin: Boolean (default: false),
  providers: Object (OAuth providers),
  avatar: String,
  timestamps: true
}
```

### Article Model

```javascript
{
  title: String (required, max 140 chars),
  body: String (required, max 10k chars),
  source: String,
  visibility: String (enum: public/private),
  owner: ObjectId (ref: User),
  ownerName: String (denormalized),
  createdAt: Date,
  updatedAt: Date
}
```

### Summary Model

```javascript
{
  originalText: String (required),
  summaryText: String (required),
  user: ObjectId (ref: User),
  ownerName: String (denormalized),
  createdAt: Date
}
```

## 🔐 Authentication & Authorization

### JWT Authentication

- Access tokens: 15-minute expiration
- Refresh tokens: 7-day expiration
- HTTP-only cookies for security
- Automatic token refresh on API calls

### Middleware

- **Auth Middleware**: Validates JWT tokens
- **Admin Middleware**: Checks admin privileges
- **CORS**: Configured for frontend domain

### Password Security

- bcrypt hashing with salt rounds
- Strong password requirements (8-64 chars, uppercase, lowercase, digit, special char)

## 🚀 Deployment

### Backend Deployment

- **Platform**: Render/Heroku/Railway
- **Environment**: Production Node.js
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud/Upstash
- **Container**: Docker support included

### Frontend Deployment

- **Platform**: Vercel
- **Build**: Vite production build
- **Routing**: SPA rewrites configured
- **Environment**: Production API endpoints

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run individual services
docker build -t newsgpt-backend ./backend
docker build -t newsgpt-frontend ./frontend
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test  # Runs Mocha test suite
```

**Test Coverage:**

- Authentication (login, signup, tokens)
- Article CRUD operations
- Summary generation
- Admin functionality
- Middleware validation

### Frontend Testing

- Manual testing recommended
- Component integration testing
- API integration verification

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- MongoDB
- Redis
- Docker (optional)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Configure environment variables
npm run dev  # Development server
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env  # Configure API URL
npm run dev  # Development server
```

### Environment Variables

#### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/newsgpt
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_USERNAME=default
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
HF_TOKEN=your_huggingface_token
```

#### Frontend (.env)

```env
VITE_URL=http://localhost:5000
```

## 📊 Performance Features

### Caching Strategy

- Redis caching for frequently accessed data
- Article and summary pagination caching
- Cache invalidation on data modifications

### Database Optimization

- Indexed fields for efficient queries
- Denormalized ownerName for performance
- Pagination for large datasets

### AI Integration

- Hugging Face BART model for summarization
- Mock responses for testing environments
- Error handling for API failures

## 🔒 Security Features

- JWT authentication with secure cookies
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Admin route protection
- SQL injection prevention (MongoDB)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Arjun Chandel** - _Initial work_ - [GitHub](https://github.com/Arjun-Chandel910)

## 🙏 Acknowledgments

- Hugging Face for AI model access
- React and Express communities
- Open source contributors

---

**Last Updated**: November 2025
**Version**: 1.0.0
