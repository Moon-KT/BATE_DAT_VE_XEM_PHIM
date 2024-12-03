import random
from datetime import datetime, timedelta
from unidecode import unidecode
import bcrypt

def random_address():
    streets = ["Nguyễn Trãi", "Lê Lợi", "Trần Hưng Đạo", "Phạm Ngũ Lão", "Hoàng Diệu", "Huỳnh Tấn Phát", "Phan Đình Phùng", "Vũ Tông Phan", "Võ Thị Sáu", "Đặng Văn Ngữ", "Bùi Thị Xuân"]
    districts = ["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10", "Quận 11"]
    cities = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Nha Trang", "Huế", "Vũng Tàu", "Biên Hòa", "Buôn Ma Thuột", "Đà Lạt"]

    street = random.choice(streets)
    district = random.choice(districts)
    city = random.choice(cities)
    address = f"{street}, {district}, {city}"
    return address

def random_password(length=10):
    characters = '12345'
    password = ''.join(random.choice(characters) for _ in range(length))
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password.decode('utf-8')

def random_phone_number():
    return "0" + ''.join(random.choice("0123456789") for _ in range(9))

def random_user_data():
    first_names = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng","Bùi"]
    middle_names = ["Minh", "Văn", "Thị", "Hữu", "Quốc", "Ngọc", "Thanh", "Thảo", "Anh", "Tấn", "Hồng"]
    last_names = ["Hồng","Phượng", "Hà", "Quỳnh", "Minh", "Trung", "Anh", "Chi", "Dung", "Hằng"]
    genders = ["FEMALE", "MALE", "OTHERS"]

    values = []
    used_usernames = set()

    for i in range(200):
        start_date = datetime(1990, 1, 1)
        end_date = datetime(2004, 12, 31)
        birthday = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))

        min_join_date = birthday + timedelta(days=365 * 10)
        max_join_date = datetime.now()
        join_date = min_join_date + timedelta(days=random.randint(0, (max_join_date - min_join_date).days))

        random_time = timedelta(
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59),
            seconds=random.randint(0, 59)
        )
        join_date += random_time

        while True:
            username = f"{random.choice(first_names)} {random.choice(middle_names)} {random.choice(last_names)}"
            if username not in used_usernames:
                used_usernames.add(username)
                break

        address = random_address()
        gender = random.choice(genders)
        total_spent = random.randint(0, 1000) * 1000
        if total_spent >= 5000000:
            membership_id = 3
        elif total_spent > 3000000:
            membership_id = 2
        else:
            membership_id = 1
        accumulated_points = total_spent  # Assuming accumulated points are equal to total spent
        birthday_str = birthday.strftime('%Y-%m-%d')
        join_date_str = join_date.strftime('%Y-%m-%d %H:%M:%S')
        email = unidecode(username.replace(" ", "").lower()) + "@gmail.com"
        password = random_password()
        phone_number = random_phone_number()

        values.append(f"('{username}', '{birthday_str}', '{join_date_str}', {accumulated_points}, {total_spent}, '{address}', '{gender}', '{email}', {membership_id}, '{password}', '{phone_number}', true)")

    return values

insert_values = random_user_data()
insert_sql = "INSERT INTO user (user_name, birthday, start_join, accumulated_points, total_spent, address, gender, email, membership_id, password, phone, enabled)\nVALUES\n"
insert_sql += ",\n       ".join(insert_values) + ";"

with open("user.sql", "w", encoding="utf-8") as file:
    file.write(insert_sql)