import random as rd

# Define booking_id and combo_id ranges
booking_ids = range(1, 1001)  # booking_id from 1 to 1000
combo_ids = range(1, 5)       # combo_id from 1 to 4

# Construct SQL values for all records
values = []
for booking_id in booking_ids:
    combo_id = rd.choice(combo_ids)  # Randomly select one combo_id for each booking_id
    quantity = rd.randint(1, 5)      # Generate a random quantity between 1 and 5
    values.append(f"({booking_id}, {combo_id}, {quantity})")

# Create the SQL batch for insert
insert_sql = "INSERT INTO booking_combo (booking_id, combo_id, quantity)\nVALUES "
insert_sql += ",\n       ".join(values) + ";"

# Write the SQL statement to booking_combo.sql
with open("booking_combo.sql", "w") as file:
    file.write(insert_sql)