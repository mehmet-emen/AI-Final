# Smart Route Navigator
## Description
Smart Route Navigator is a web-based shortest path finder developed for the MSKÜ campus using Dijkstra's Algorithm. The system calculates the optimal route between user-selected landmarks and visualizes it on an interactive Leaflet map.
## Tech Stack
- **Backend:** Python (Flask)
- **Frontend:** HTML, CSS, JavaScript (Leaflet.js)
- **Data:** JSON (Graph structure)
## Setup
Install the required Python packages:
=> pip install flask flask-cors
## How to Run
### Start the Backend
Open a terminal and run the main Python script:
=> python main.py
### Start the Live Server
Open a new terminal (keep the backend running) and start the local server:
=> python -m http.server 8000
### Test
Open your browser and navigate to:
=> http://localhost:8000
## Features
- Interactive MSKU campus map
- Shortest path calculation using Dijkstra’s Algorithm
- Real-time route visualization
- Distance calculation between landmarks
