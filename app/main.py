import uuid
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import User, Entry
from app.schemas import LoginRequest, LoginResponse, EntryIn, EntryOut
from app.auth import verify_password

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Copiko & Milo Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://us-our-personal-diary.vercel.app",  # replace with your real domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _to_out(e: Entry) -> EntryOut:
    return EntryOut(
        id=e.id, section=e.section, title=e.title, date=e.date,
        coverUrl=e.cover_url, coverOffsetY=e.cover_offset_y, icon=e.icon,
        content=e.content, drawingLayer=e.drawing_layer,
        mediaItems=e.media_items or [], povContent=e.pov_content,
    )


@app.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username).first()
    if user is None or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid username or password.")
    return LoginResponse(message="Login successful.", username=user.username)


@app.get("/entries", response_model=list[EntryOut])
def list_entries(section: str, db: Session = Depends(get_db)):
    rows = db.query(Entry).filter(Entry.section == section).order_by(Entry.date.desc()).all()
    return [_to_out(r) for r in rows]


@app.get("/entries/{entry_id}", response_model=EntryOut)
def get_entry(entry_id: str, db: Session = Depends(get_db)):
    row = db.query(Entry).filter(Entry.id == entry_id).first()
    if not row:
        raise HTTPException(404, "Entry not found")
    return _to_out(row)


@app.post("/entries", response_model=EntryOut)
def create_entry(payload: EntryIn, db: Session = Depends(get_db)):
    row = Entry(
        id=f"entry-{uuid.uuid4().hex[:12]}",
        section=payload.section, title=payload.title, date=payload.date,
        cover_url=payload.coverUrl, cover_offset_y=payload.coverOffsetY, icon=payload.icon,
        content=payload.content, drawing_layer=payload.drawingLayer,
        media_items=payload.mediaItems, pov_content=payload.povContent,
    )
    db.add(row); db.commit(); db.refresh(row)
    return _to_out(row)


@app.put("/entries/{entry_id}", response_model=EntryOut)
def update_entry(entry_id: str, payload: EntryIn, db: Session = Depends(get_db)):
    row = db.query(Entry).filter(Entry.id == entry_id).first()
    if not row:
        raise HTTPException(404, "Entry not found")
    row.section, row.title, row.date = payload.section, payload.title, payload.date
    row.cover_url, row.cover_offset_y, row.icon = payload.coverUrl, payload.coverOffsetY, payload.icon
    row.content, row.drawing_layer = payload.content, payload.drawingLayer
    row.media_items, row.pov_content = payload.mediaItems, payload.povContent
    db.commit(); db.refresh(row)
    return _to_out(row)


@app.delete("/entries/{entry_id}")
def delete_entry(entry_id: str, db: Session = Depends(get_db)):
    row = db.query(Entry).filter(Entry.id == entry_id).first()
    if row:
        db.delete(row); db.commit()
    return {"ok": True}