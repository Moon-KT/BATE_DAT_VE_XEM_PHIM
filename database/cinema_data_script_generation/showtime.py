import random
from datetime import datetime, timedelta

# Define available movie and seat IDs
movie_ids = list(range(1, 26))  # Movie IDs from 1 to 25
room_ids = list(range(1, 77))  # Room IDs from 1 to 76

# Define the date range
date_min = datetime.strptime("2024-11-15", "%Y-%m-%d")
date_max = datetime.strptime("2024-12-31", "%Y-%m-%d")

# Define the time range
start_time_min_hour = 9
start_time_max_hour = 23
minute_options = [0, 15, 30]

# Generate random date within the specified range
def random_date():
    delta_days = (date_max - date_min).days
    random_days = random.randint(0, delta_days)
    return date_min + timedelta(days=random_days)

# Generate random time within the specified range
def random_time():
    random_hour = random.choice(range(start_time_min_hour, start_time_max_hour + 1, 2))
    random_minute = random.choice(minute_options)
    return datetime.strptime(f"{random_hour:02}:{random_minute:02}", "%H:%M").time()

# Construct SQL values for 1500 records
values = []
for _ in range(1500):
    show_date = random_date()
    show_time = random_time()
    show_datetime = datetime.combine(show_date, show_time).strftime('%Y-%m-%d %H:%M:%S')
    movie_id = random.choice(movie_ids)
    room_id = random.choice(room_ids)
    values.append(f"('{show_datetime}', {movie_id}, {room_id})")

# Create the SQL batch for insert
insert_sql = "INSERT INTO showtimes (start_time, movie_id, room_id) VALUES\n"
insert_sql += ",\n       ".join(values) + ";"

with open("showtime.sql", "w", encoding='utf-8') as file:
    file.write(insert_sql)

print("SQL file saved as showtimes.sql")
