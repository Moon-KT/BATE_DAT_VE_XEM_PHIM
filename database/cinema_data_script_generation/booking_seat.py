import random

# Define booking_id and seat_id ranges
booking_ids = range(1, 1001)  # booking_id from 1 to 1000
seat_ids = range(1, 7525)     # seat_id from 1 to 7524

# Initialize a set to hold unique insert values
values = set()

# Generate 1000 unique combinations
while len(values) < 1000:
    booking_id = random.choice(booking_ids)
    seat_id = random.choice(seat_ids)
    values.add((booking_id, seat_id))

# Construct SQL values for all records
sql_values = [f"({booking_id}, {seat_id}, 'Booked')" for booking_id, seat_id in values]

# Create the SQL batch for insert
insert_sql = "INSERT INTO booking_seat (booking_id, seat_id, seat_status)\nVALUES "
insert_sql += ",\n       ".join(sql_values) + ";"

# Write the SQL statement to booking_seat.sql
with open("booking_seat.sql", "w") as file:
    file.write(insert_sql)