# Define cinema_ids (assuming they are integers from 1 to 19)
cinema_ids = list(range(1, 20))

# Generate room names 'P1', 'P2', 'P3', 'P4' for each cinema
room_names = [f"P{number}" for number in range(1, 5)]

# Construct the SQL batch with room_name and cinema_id
insert_sql = "INSERT INTO screening_rooms(room_name, cinema_id)\nVALUES "
values = ",\n       ".join(
    f"('{room_names[i % len(room_names)]}', {cinema_id})"
    for cinema_id in cinema_ids
    for i in range(len(room_names))
) + ";"

# Write the SQL to a file
with open("rooms.sql", "w", encoding="utf-8") as file:
    file.write(insert_sql + values)