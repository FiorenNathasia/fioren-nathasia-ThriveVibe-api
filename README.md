## 1. Install Dependencies:

Make sure you have Node.js and npm installed on your machine. Navigate to the backend project directory using a terminal, and run:bash

### `npm install`

This will install all the required dependencies specified in the package.json file

## 2. Create .env file:

In the project directory, you can run:

### `npm install knex mysql2 dotenv`

- Create a new MySQL database schema
- Add a .env file under root directory with following contents. Replace all information a so,
  PORT=2222
  DB_HOST=127.0.0.1
  DB_NAME=ThriveVibe
  DB_USER=root
  DB_PASSWORD=rootroot
  JWT_KEY=<your_password>

## 3. Run Migrations:

Once your database is set up and the configuration is correct, you can run migrations to create the necessary tables. Use the following command:bash

### `npx knex migrate:latest `

This command will execute the latest migrations and create tables in your database.

## 4. Seed Data:

If your project includes seed files (files that populate your database with initial data), you can run the seed command:bash

### `npx knex seed:run `

This step is optional and depends on whether your project utilizes seed files.

## 5. Start the Server:

After migrations are complete, you can start your Express server:bash

### `npm start `
