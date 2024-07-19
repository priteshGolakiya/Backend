Create .env File:
Create a .env file in the root directory of your project.

Add the following environment variables to .env:
PORT=5000
MONGO_URI=your_db_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRY=1d

Replace your_db_connection_string with the actual URI to your MongoDB database and your_secret_key with your chosen secret for JWT token generation.
