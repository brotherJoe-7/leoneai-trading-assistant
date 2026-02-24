from app.db.session import SessionLocal
from app.crud.user import user as crud_user

db = SessionLocal()
user = crud_user.get_by_username(db, username="admin")
if user:
    print(f"User found: {user.username} (ID: {user.id})")
else:
    print("User 'admin' not found")
db.close()
