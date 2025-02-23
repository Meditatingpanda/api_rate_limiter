# Rate-Limited API with SQLite

This project demonstrates a rate-limited API implementation using SQLite as the database. It showcases an approach to rate limiting and provides a simple setup for local development.
## Dark Mode
<img width="1488" alt="Screenshot 2024-10-11 at 5 36 22 AM" src="https://github.com/user-attachments/assets/5c232fd0-5bdd-43cd-a16e-4ccf68915807">
<img width="1488" alt="Screenshot 2024-10-11 at 5 37 44 AM" src="https://github.com/user-attachments/assets/0ac0f333-91ef-4288-a17a-311c26094dc0">

## Light Mode

<img width="1488" alt="Screenshot 2024-10-11 at 5 38 31 AM" src="https://github.com/user-attachments/assets/55fd1ca2-a23b-464a-ad30-8ac53d0288c9">
<img width="1488" alt="Screenshot 2024-10-11 at 5 57 18 AM" src="https://github.com/user-attachments/assets/f51a1eab-b778-46aa-a4b1-b164d8135089">
<img width="1488" alt="Screenshot 2024-10-11 at 5 57 46 AM" src="https://github.com/user-attachments/assets/7386d7da-664f-48fd-b518-c2036a788cc1">


## Rate Limiting Approach

The rate limiting in this project is implemented using a token bucket algorithm. This approach offers several advantages:

1. **Flexibility**: It allows for bursts of traffic while still maintaining an average rate limit.
2. **Efficiency**: The token bucket algorithm is computationally efficient and easy to implement.
3. **Customizability**: The rate limit can be easily adjusted by modifying the token replenishment rate and bucket size.

The implementation stores the last request timestamp and remaining tokens for each user in the SQLite database. This allows for persistent rate limiting across server restarts.

### Implementation Details

The rate limiting is implemented using two main components:

1. **Database Schema**: We use Prisma with SQLite to define two models:
   - `RateLimit`: Stores the current rate limit status for each user.
   - `RateViolation`: Records any rate limit violations.

2. **Middleware**: A `rateLimiter` middleware that:
   - Retrieves or creates a rate limit record for each request.
   - Resets counters if the time window has passed.
   - Checks for and records violations.
   - Updates the rate limit record after each request.

The rate limits are configurable through environment variables:
- `MINUTE_LIMIT`: Maximum requests allowed per minute (default: 3)
- `DAILY_LIMIT`: Maximum requests allowed per day (default: 10)

## SQLite as Database

SQLite is chosen as the database for this project for several reasons:

1. **Simplicity**: SQLite is a self-contained, serverless database that doesn't require a separate server process.
2. **Portability**: The entire database is stored in a single file, making it easy to backup, move, or version control.
3. **Low overhead**: SQLite has minimal setup requirements and is perfect for small to medium-sized applications.
4. **Built-in support**: Many programming languages, including TypeScript with Prisma, have excellent support for SQLite.

## Local Setup and Running

To set up and run this project locally, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/Meditatingpanda/api_rate_limiter
   cd api_rate_limiter
   ```

2. Install the required dependencies:

   ```
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root of backend directory and add your database URL: ( Note: .env file kept intentionally in version control, if not present add this by following above instructions)

   ```
   DATABASE_URL="file:./dev.db"
   MINUTE_LIMIT=3
   DAILY_LIMIT=10
   ```

4. Run the application:
   ```
   npm run dev
   ```
NOTE: if your port 8080 is not available, make the following changes

Update PORT Inside the backend.

Update API url in the constant file `frontend/src/constants/API.ts`

As we are using it concurrently for this, it should run both frontend and backend for this

Frontend URL: `http://localhost:5173`

Backend URL: `http://localhost:8080`

## API Endpoints

- `POST /api/v1/sms`: Send an SMS
- `GET /api/v1/sms/sent`: Get the number of SMS sent in a specified time range in seconds
- `GET /api/v1/sms/rate-limit-status`: Get the rate limit status in the specified time range in seconds
- `GET /api/v1/sms`: Get all SMS

For more details on these endpoints, refer to the `smsController.ts` file:
