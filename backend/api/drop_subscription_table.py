import sqlite3

DB_PATH = "leoneai.db"


def drop_table():
    print(f"Connecting to {DB_PATH}...")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        print("Dropping subscriptions table...")
        cursor.execute("DROP TABLE IF EXISTS subscriptions")
        conn.commit()
        print("Table dropped.")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    drop_table()
