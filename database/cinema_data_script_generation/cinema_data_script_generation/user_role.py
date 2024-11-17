# Initialize an empty list to store the values
values = []

# Loop through the user_id range and assign role_id based on the conditions
for user_id in range(1, 201):
    role_id = 1 if user_id <= 10 else 2
    values.append(f"({user_id}, {role_id})")

# Combine all values into one INSERT statement
sql_insert_output = f"INSERT INTO users (user_id, role_id) VALUES {', '.join(values)};"

# Output the SQL string
with open("user_role.sql", 'w') as file:
    file.write(sql_insert_output)
