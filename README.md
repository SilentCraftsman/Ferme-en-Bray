## Ferme en Bray Project
This project consists of a backend server and a frontend client for managing and displaying information about a poultry farm.  

### Prerequisites
- Node.js (>= 18.0.0)
- npm (Node Package Manager)

### Installation
#### Backend
1. Navigate to the backend directory:  
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a .env file:
    - Copy the contents of `.env.template` to `.env`.
    - Fill in the required environment variables in the `.env` file.
4. Start the backend server:
   ```bash
   npm run dev
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a .env file:
    - Copy the contents of `.env.template` to `.env`.
    - Fill in the required environment variables in the `.env` file.
4. To start the server as development mode:
   ```bash
   npm run dev
   ```

### Running the Application
- Backend: The backend server will run on [http://localhost:3001](http://localhost:3001) by default.
- Frontend: The frontend server will run on [http://localhost:3000](http://localhost:3000) by default.

### Scripts
#### Backend
- `npm start`: Start the backend server.
- `npm run dev`: Start the backend server with nodemon for development.
- `npm run lint`: Run ESLint to check for linting errors.
- `npm run lint:fix`: Run ESLint and automatically fix linting errors.
- `npm run prettier:fix`: Run Prettier to format the code.

#### Frontend
- `npm run dev`: Start the frontend server in development mode.
- `npm run build`: Build the frontend for production.
- `npm run export`: Export the frontend as a static site.
- `npm start`: Serve the static site using serve.
- `npm run lint`: Run ESLint to check for linting errors.