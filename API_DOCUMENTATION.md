# Abel Consultant LLC - Backend API Documentation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file in the root directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:3000
```

### Start the Server
```bash
# Development
npm run dev

# Production
npm start

# Test API
npm run test-api
```

---

## 📋 API Endpoints

### Health Check
- **GET** `/api/health` - Check server status

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user

### Products
- **GET** `/api/products/electronics` - Get all electronics
- **GET** `/api/products/cars` - Get all cars
- **GET** `/api/products/spare-parts` - Get all spare parts
- **POST** `/api/products/electronics` - Add new electronic (Admin only)
- **POST** `/api/products/cars` - Add new car (Admin only)
- **POST** `/api/products/spare-parts` - Add new spare part (Admin only)

### Orders
- **POST** `/api/orders` - Place new order (Auth required)
- **GET** `/api/orders/my` - Get user's orders (Auth required)
- **PUT** `/api/orders/:id` - Update order status (Admin only)

---

## 🔐 Authentication

### Register User
**POST** `/api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login User
**POST** `/api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 🛍️ Products

### Get Electronics
**GET** `/api/products/electronics`

**Response:**
```json
[
  {
    "_id": "product_id",
    "title": "iPhone 14",
    "description": "Latest iPhone model",
    "price": 999.99,
    "images": ["image1.jpg", "image2.jpg"],
    "stock": 50,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Add Electronic (Admin Only)
**POST** `/api/products/electronics`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Body:**
```json
{
  "title": "iPhone 14",
  "description": "Latest iPhone model",
  "price": 999.99,
  "images": ["image1.jpg", "image2.jpg"],
  "stock": 50
}
```

---

## 📦 Orders

### Place Order
**POST** `/api/orders`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Body:**
```json
{
  "productType": "electronic",
  "productId": "product_id_here"
}
```

**Response:**
```json
{
  "_id": "order_id",
  "user": "user_id",
  "productType": "electronic",
  "productId": "product_id_here",
  "status": "Pending",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Get My Orders
**GET** `/api/orders/my`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

---

## 🔧 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": ["Detailed error messages"]
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing

Run the API tests:
```bash
npm run test-api
```

This will test all endpoints and verify they're working correctly.

---

## 📧 Email Configuration

For order notifications, configure your email settings in the `.env` file:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Note: For Gmail, you'll need to use an App Password instead of your regular password.

---

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation
- CORS protection
- Error handling middleware
- Role-based access control

---

## 📝 Notes

- All POST requests require `Content-Type: application/json`
- Admin endpoints require JWT token with admin role
- Email notifications are sent for order placement and status updates
- All responses include appropriate HTTP status codes
