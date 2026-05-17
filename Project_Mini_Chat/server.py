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
# ws -> username
clients = {}

# ================= BROADCAST USERS =================
async def broadcast_users():
    users = list(clients.values())

    for ws in clients.keys():
        try:
            await ws.send_text(json.dumps({
                "type": "users",
                "users": users
            }))
        except:
            pass

# ================= WEBSOCKET =================
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    username = None
    clients[websocket] = "Anonyme"

    # historique
    for row in conn.execute("SELECT data FROM messages"):
        await websocket.send_text(row[0])

    await broadcast_users()

    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)

            # ================= LOGIN =================
            if msg["type"] == "login":
                username = msg["user"]
                clients[websocket] = username
                await broadcast_users()
                continue

            sender = clients.get(websocket, "Anonyme")

            # ================= MESSAGE =================
            if msg["type"] == "message":

                msg["user"] = sender

                # sauvegarde
                conn.execute(
                    "INSERT INTO messages (data) VALUES (?)",
                    (json.dumps(msg),)
                )
                conn.commit()

                is_private = msg.get("to") and msg["to"] != "all"

                # broadcast intelligent
                for client, user in clients.items():

                    if client.closed:
                        continue

                    try:
                        if (
                            not is_private
                            or user == msg["to"]
                            or client == websocket
                        ):
                            await client.send_text(json.dumps(msg))
                    except:
                        pass

            # ================= TYPING =================
            if msg["type"] == "typing":

                for client in clients.keys():
                    if client != websocket:
                        try:
                            await client.send_text(json.dumps({
                                "type": "typing",
                                "user": sender
                            }))
                        except:
                            pass

    except WebSocketDisconnect:
        if websocket in clients:
            del clients[websocket]
        await broadcast_users()

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