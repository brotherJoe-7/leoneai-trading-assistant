import sqlite3

# Adjust path to your database file
DB_PATH = "leoneai.db"


def add_column():
    print(f"Connecting to {DB_PATH}...")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check if column exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [info[1] for info in cursor.fetchall()]

        if "plan_type" not in columns:
            print("Adding plan_type column to users table...")
            cursor.execute(
                "ALTER TABLE users ADD COLUMN plan_type VARCHAR(20) DEFAULT 'FREE'"
            )
            conn.commit()
            print("Column added successfully.")
        else:
            print("Column plan_type already exists.")

        conn.close()
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    add_column()
