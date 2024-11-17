import random

# Define the range for movie_id and genre_id
movie_ids = range(1, 11)
genre_ids = range(1, 11)

# List to hold the values for the insert statement
values = []

# Generate two random genres for each movie
for movie_id in movie_ids:
    genres = random.sample(genre_ids, 2)
    for genre_id in genres:
        values.append(f"({movie_id}, {genre_id})")

# Concatenate all values into a single string
values_string = ", ".join(values)

# Create the final insert statement
final_string = f"INSERT INTO movie_genre (movie_id, genre_id) VALUES {values_string};"

# Write the final string to movie_genre.sql
with open("movie_genre.sql", "w") as file:
    file.write(final_string)

print("SQL insert statement has been written to movie_genre.sql")