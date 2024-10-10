# Rate-Limited API with SQLite

This project demonstrates a rate-limited API implementation using SQLite as the database. It showcases an approach to rate limiting and provides a simple setup for local development.

## Rate Limiting Approach

The rate limiting in this project is implemented using a token bucket algorithm. This approach offers several advantages:

1. **Flexibility**: It allows for bursts of traffic while still maintaining an average rate limit.
2. **Efficiency**: The token bucket algorithm is computationally efficient and easy to implement.
3. **Customizability**: The rate limit can be easily adjusted by modifying the token replenishment rate and bucket size.

The implementation stores the last request timestamp and remaining tokens for each user in the SQLite database. This allows for persistent rate limiting across server restarts.

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
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install the required dependencies:

   ```
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add your database URL:

   ```
   DATABASE_URL="file:./dev.db"
   MINUTE_LIMIT=3
   DAILY_LIMIT=10
   ```

4. Initialize the SQLite database:

   ```
   npx prisma migrate dev
   ```

5. Run the application:
   ```
   npm run dev
   ```

The API should now be running locally, typically at `http://localhost:8080`. You can test the rate-limited endpoints using tools like cURL or Postman.

## API Endpoints

- `POST /api/v1/sms`: Send an SMS
- `GET /api/v1/sms/sent`: Get the number of SMS sent in a specified time range
- `GET /api/v1/sms/rate-limit-status`: Get the rate limit status
- `GET /api/v1/sms`: Get all SMS

For more details on these endpoints, refer to the `smsController.ts` file:


