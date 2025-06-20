# PPOB REST API

A complete REST API application for Payment Point Online Bank (PPOB) services built with Node.js and Express.js.

## Features

### 1. Membership Module
- **POST /registration** - User registration
- **POST /login** - User authentication with JWT
- **GET /profile** - Get user profile information
- **PUT /profile/update** - Update user profile data
- **PUT /profile/image** - Upload/update profile image

### 2. Information Module
- **GET /banner** - Get banner list (public)
- **GET /services** - Get PPOB services list (private)

### 3. Transaction Module
- **GET /balance** - Check user balance
- **POST /topup** - Top up user balance
- **POST /transaction** - Make payment transaction
- **GET /transaction/history** - Get transaction history

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with raw queries and prepared statements
- **Authentication**: JWT (JSON Web Token)
- **Validation**: Joi
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create MySQL database and run the schema:
   ```sql
   -- Execute the SQL commands in src/database/schema.sql
   ```
4. Configure environment variables in `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=ppob_api
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=12h
   PORT=3000
   BASE_URL=http://localhost:3000
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication
- JWT tokens are required for private endpoints
- Include token in Authorization header: `Bearer <token>`
- Tokens expire after 12 hours

### Response Format
All responses follow this structure:
```json
{
  "status": 0,
  "message": "Success message",
  "data": {} // or null
}
```

### Error Codes
- `0`: Success
- `102`: Bad Request / Validation Error
- `103`: Authentication Error
- `108`: Token Invalid/Expired

### Database Design

#### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `first_name`
- `last_name`
- `password` (Hashed)
- `profile_image`
- `balance` (Decimal)
- `created_at`, `updated_at`

#### Services Table
- `id` (Primary Key)
- `service_code` (Unique)
- `service_name`
- `service_icon`
- `service_tariff`
- `is_active`

#### Transactions Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `invoice_number` (Unique)
- `transaction_type` (TOPUP/PAYMENT)
- `description`
- `total_amount`
- `service_code`
- `balance_before`, `balance_after`
- `created_at`

#### Banners Table
- `id` (Primary Key)
- `banner_name`
- `banner_image`
- `description`
- `is_active`

## Key Features

### Security
- Password hashing with bcrypt
- JWT authentication
- Input validation with Joi
- SQL injection protection with prepared statements
- Rate limiting
- CORS configuration
- Helmet security headers

### Balance Management
- Atomic transactions for balance updates
- Row-level locking to prevent race conditions
- Accurate balance calculations
- Transaction history tracking

### File Upload
- Image format validation (JPEG, PNG only)
- File size limits (5MB)
- Secure file naming
- Error handling for upload failures

### Error Handling
- Global error handler
- Consistent error response format
- Detailed validation messages
- Database error handling

## Development

- Use `npm run dev` for development with nodemon
- Use `npm start` for production
- Follow SOLID and DRY principles
- All database queries use prepared statements
- Comprehensive input validation
- Clean, structured, and maintainable code

## Testing

```bash
npm test
```
