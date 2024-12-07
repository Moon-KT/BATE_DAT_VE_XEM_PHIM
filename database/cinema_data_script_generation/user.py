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
    first_names = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng","Bùi", "Đỗ", "Ngô", "Dương", "Lý", "Hồ", "Chu", "Vương", "Lưu", "Trịnh", "Đinh", "Phùng", "Trương", "Lâm", "Kiều", "Mai", "Tô", "Tăng", "Hà", "Đoàn", "Bạch", "Tạ", "Thạch", "Tiêu", "Từ", "Thái", "Sử", "Hứa", "Tôn", "Lục", "Đường", "Quách", "Đinh", "Đồng", "Tống", "Hạc", "Đổng", "Từ", "Thủy", "Thi", "Từ", "Tô", "Tống"]
    middle_names = ["Minh", "Văn", "Thị", "Hữu", "Quốc", "Ngọc", "Thanh", "Thảo", "Anh", "Tấn", "Hồng","Kiều", "Đức"]
    last_names = ["Quang", "Hùng", "Trang", "Lan", "Hương", "Tú", "Dũng", "Hạnh", "Phương", "Bình", "Phúc", "Thắng", "Hải", "Hà", "Thành", "Thảo", "Thu", "Hoa", "Sơn", "Linh", "Nhung", "Nga", "Thi", "Tâm", "Tân"]
    genders = ["FEMALE", "MALE", "OTHERS"]

    values = []
    usernames = set()

    for i in range(200):
        start_date = datetime(1950, 1, 1)
        end_date = datetime(2003, 12, 31)
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
            if username not in usernames:
                usernames.add(username)
                break

        address = random_address()
        gender = random.choice(genders)
        membership_id = "null" if i < 10 else random.choice([1, 2, 3])
        accumulated_points = "null" if i < 10 else random.randint(0, 100) * 1000
        total_spent = "null" if i < 10 else random.randint(0, 100) * 1000
        birthday_str = birthday.strftime('%Y-%m-%d')
        join_date_str = join_date.strftime('%Y-%m-%d %H:%M:%S')
        email = unidecode(username.replace(" ", "").lower()) + "@gmail.com"
        password = random_password()
        phone_number = random_phone_number()
        role_id = 1 if i < 10 else 2

        values.append(f"('{username}', '{birthday_str}', '{join_date_str}', {accumulated_points}, {total_spent}, '{address}', '{gender}', '{email}', {membership_id}, '{password}', '{phone_number}', true, {role_id})")

    return values

insert_values = random_user_data()
insert_sql = "INSERT INTO user (user_name, birthday, start_join, accumulated_points, total_spent, address, gender, email, membership_id, password, phone, enabled, role_id)\nVALUES\n"
insert_sql += ",\n       ".join(insert_values) + ";"

with open("user.sql", "w", encoding="utf-8") as file:
    file.write(insert_sql)