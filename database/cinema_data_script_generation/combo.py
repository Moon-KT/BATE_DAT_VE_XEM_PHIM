import requests
from bs4 import BeautifulSoup

# URL of the page to scrape
url = 'https://www.cgv.vn/default/newsoffer/cgv-jujutsu-combo/'

# Send a GET request to the URL
response = requests.get(url)

# Parse the HTML content using BeautifulSoup
soup = BeautifulSoup(response.content, 'html.parser')

# Find all <a> tags
a_tags = soup.find_all('a')

# Extract and print the href attribute of each <a> tag
for tag in a_tags:
    href = tag.get('href')
    if href:
        print(href)