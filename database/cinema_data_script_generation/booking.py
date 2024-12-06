import random
from datetime import datetime, timedelta

# Constants
date_min = datetime.strptime("2024-10-01", "%Y-%m-%d")
date_max = datetime.strptime("2024-11-12", "%Y-%m-%d")
showtime_range = range(1, 1500)  # Showtime IDs
user_range = range(8, 188)  # Admin, no accumulated points/total spent

# Function to generate a random booking date within the specified range
def random_booking_date():
    delta_days = (date_max - date_min).days
    random_days = random.randint(0, delta_days)
    
    # Generate random time between 9:00 and 23:00
    random_hours = random.randint(9, 23)
    random_minutes = random.randint(0, 59)
    
    # Create a datetime object
    booking_time = datetime(date_min.year, date_min.month, date_min.day) + timedelta(days=random_days)
    booking_time = booking_time.replace(hour=random_hours, minute=random_minutes)

    return booking_time.strftime("%Y-%m-%d %H:%M:%S")

# Function to generate a random price greater than 40000
def random_price():
    return random.randint(40001, 100000)  # Generates a whole number between 40001 and 100000

# Construct SQL values for 1000 records
values = []
for _ in range(1000):
    booking_date = random_booking_date()
    total_price = random_price()
    point_earned = random_price() # Use random_price() for point_earned
    showtime_id = random.choice(showtime_range)
    user_id = random.choice(user_range)
    
    # Ensure booking_date is properly formatted for SQL
    values.append(f"({user_id}, {showtime_id}, {total_price}, {point_earned}, '{booking_date}')")

# Create the SQL batch for insert
insert_sql = "INSERT INTO booking (user_id, showtime_id, total_price, points_earned, booking_time)\nVALUES "
insert_sql += ",\n       ".join(values) + ";"

# Write the SQL statement to booking.sql
with open("booking.sql", "w") as file:
    file.write(insert_sql)