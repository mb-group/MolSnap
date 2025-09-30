# molsnap (frontend) + monspan-api (backend)
### Frontend
1. Install Node.js and npm if you haven't already.
2. Navigate to the `molsnap` directory:
   ```bash
   cd molsnap
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. The frontend will be running at `http://localhost:5173`.

### Backend
1. ```bash
   pip install -r requirements.txt
   ```
2. Run the server
   ```bash
   uvicorn main:app --reload
   ```
   The api will run on `http://localhost:8000`