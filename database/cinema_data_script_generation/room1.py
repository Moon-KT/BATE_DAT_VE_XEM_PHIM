import itertools

# Define cinema_ids (assuming they are integers from 1 to 19)
cinema_ids = list(range(1, 20))

# Generate room names as combinations of 'A' to 'D' and '0' to '9'
room_names = [f"{letter}{number}" for letter, number in itertools.product('P', '1234')]

# Limit to the first 38 room names
room_names = room_names[:38]

print(room_names)
# # Construct the SQL batch with room_name and cinema_id
# insert_sql = "INSERT INTO screening_rooms(room_name, cinema_id)\nVALUES "
# values = ",\n       ".join(f"('{room_names[i]}', {cinema_ids[i % len(cinema_ids)]})" for i in range(38)) + ";"

# # Output the SQL statement
# print(insert_sql + values)
