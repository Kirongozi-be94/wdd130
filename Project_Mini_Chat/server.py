from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import sqlite3
import shutil
import json
import time

app = FastAPI()

# ================= DATABASE =================
conn = sqlite3.connect("chat.db", check_same_thread=False)
conn.execute("""
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT
)
""")
conn.commit()

# ================= PATHS =================
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
UPLOAD_DIR = STATIC_DIR / "uploads"

STATIC_DIR.mkdir(exist_ok=True)
UPLOAD_DIR.mkdir(exist_ok=True)

# ================= CLIENTS =================
clients = []

# ================= WEBSOCKET =================
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)

    # envoyer historique
    for row in conn.execute("SELECT data FROM messages"):
        await websocket.send_text(row[0])

    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)

            # sauvegarde sauf typing
            if msg["type"] != "typing":
                conn.execute(
                    "INSERT INTO messages (data) VALUES (?)",
                    (data,)
                )
                conn.commit()

            # broadcast
            dead = []

            for client in clients:
                try:
                    await client.send_text(data)
                except:
                    dead.append(client)

            for d in dead:
                if d in clients:
                    clients.remove(d)

    except WebSocketDisconnect:
        if websocket in clients:
            clients.remove(websocket)

# ================= UPLOAD =================
@app.post("/upload")
async def upload_file(file: UploadFile):

    filename = f"{int(time.time())}_{file.filename}"
    filepath = UPLOAD_DIR / filename

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"url": f"/static/uploads/{filename}"}

# ================= STATIC =================
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="frontend")