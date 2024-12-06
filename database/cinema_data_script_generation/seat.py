# A - B - C -> normal
# D - E -> VIP
# F -> couple

# Constants
seat_numbers = range(1, 19)  # Seat numbers from 1 to 18
seat_rows = [chr(i) for i in range(ord('A'), ord('F') + 1)] # Seat rows from A to F
seat_types = [1, 2, 3]  # Seat types from 1 to 3
rooms = range(1, 77) # Rooms from 1 to 76

insert_sql = "INSERT INTO seats (seat_number, seat_row, room_id, seat_type_id)\nVALUES\n"

values = []
for room in rooms:
    for row in seat_rows:
        if row in ['A', 'B', 'C']:
            seat_type = 1
        elif row in ['D', 'E']:
            seat_type = 2
        elif row == 'F':
            seat_type = 3
        
        if row == 'F':
            seat_range = range(1, 10)  # 9 seats for row F
        else:
            seat_range = range(1, 19)  # 18 seats for other rows
        
        for seat_number in seat_range:
            values.append(f"({seat_number}, '{row}', {room}, {seat_type})")

insert_sql += ",\n".join(values) + ";"

with open("seat.sql", "w") as f:
    f.write(insert_sql)