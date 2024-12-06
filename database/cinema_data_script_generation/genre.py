import sqlite3

# Connect to the database (or create it if it doesn't exist)
conn = sqlite3.connect('cinema.db')
cursor = conn.cursor()

# Create the genres table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    genre_name TEXT NOT NULL
)
''')

# Insert a new genre into the genres table
def insert_genre(genre_name):
    cursor.execute('INSERT INTO genres (genre_name) VALUES (?)', (genre_name,))
    conn.commit()

# Example usage
insert_genre('Action')
insert_genre('Comedy')
insert_genre('Drama')

# Close the connection
conn.close()