import requests
from bs4 import BeautifulSoup

# Step 1: Fetch the HTML
url = "https://betacinemas.vn/home.htm"  # Replace with the actual URL
response = requests.get(url)
html_content = response.content

# Step 2: Parse the HTML using BeautifulSoup
soup = BeautifulSoup(html_content, "html.parser")

# Step 3: Find the dropdown menus and extract key-value pairs excluding the first item
dropdown_data = {}

for submenu in soup.select("li.dropdown-submenu"):
    # Get the main menu item (key)
    key = submenu.find("a").get_text(strip=True)
    
    # Find all child items (values) and exclude the first element
    child_links = submenu.select("ul.dropdown-menu > li > a")[1:]  # Skip the first item
    values = [child.get_text(strip=True) for child in child_links]
    
    # Add to dictionary
    dropdown_data[key] = values

# Step 1: Construct SQL for inserting cities
cities = list(dropdown_data.keys())
city_sql = "INSERT INTO locations(city)\nVALUES " + ",\n".join(f"('{city}')" for city in cities) + ";"

# Step 2: Construct SQL for inserting cinemas
cinemas = [cinema for cinema_list in dropdown_data.values() for cinema in cinema_list]
cinema_sql = "INSERT INTO cinema(cinema_name)\nVALUES " + ",\n".join(f"('{cinema}')" for cinema in cinemas) + ";"

# Output the SQL statements
print("City SQL Batch:")
print(city_sql)
print("\nCinema SQL Batch:")
print(cinema_sql)
