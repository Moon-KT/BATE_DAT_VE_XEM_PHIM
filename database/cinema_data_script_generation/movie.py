# import requests
# from bs4 import BeautifulSoup

# BASE_WEBSITE = "https://betacinemas.vn/"

# def fetch_movie_data_and_save():
#     try:
#         # Make the initial request to the website
#         response = requests.get(BASE_WEBSITE)
#         document = BeautifulSoup(response.content, 'html.parser')

#         # Find all the links to the movie pages
#         links = document.select("div.tab-content a")

#         # Prepare the SQL insert statement
#         formatted_sql = "INSERT INTO movies (movie_name, movie_director, movie_actor, movie_description, movie_duration, movie_language, movie_release_date, movie_poster, movie_trailer) VALUES\n"

#         # Loop through the movie links and fetch movie details
#         for i in range(1, len(links), 3):  # Skip every 3rd element (the pattern from original Java code)
#             movie_url = BASE_WEBSITE + links[i]['href']
#             movie_response = requests.get(movie_url)
#             movie_document = BeautifulSoup(movie_response.content, 'html.parser')

#             # Extract the required data from the movie page
#             movie_name = movie_document.select_one("h1.bold.no-margin.margin-bottom-15").text
#             movie_poster = movie_document.select_one("div.pi-img-wrapper img")['src']
#             movie_description = movie_document.select_one("p.margin-bottom-15.font-lg.font-family-san.text-justify").text
#             movie_actor = movie_document.select("div.row.font-lg.font-family-san.font-xs-14")[1].select_one("div.col-lg-12").text
#             movie_duration = int(movie_document.select("div.row.font-lg.font-family-san.font-xs-14")[3].select_one("div.col-lg-12").text.replace(" phút", ""))
#             movie_release_date = movie_document.select("div.row.font-lg.font-family-san.font-xs-14")[5].select_one("div.col-lg-12").text
#             movie_language = movie_document.select("div.row.font-lg.font-family-san.font-xs-14")[4].select_one("div.col-lg-12").text
#             movie_director = movie_document.select("div.row.font-lg.font-family-san.font-xs-14")[0].select_one("div.col-lg-12").text
#             movie_trailer = movie_document.select_one("div.col-md-12.col-md-offset-2.margin-bottom-35 iframe")['src']

#             # Append the movie data as a record in the SQL statement
#             formatted_sql += f"('{movie_name}', '{movie_director}', '{movie_actor}', '{movie_description}', {movie_duration}, '{movie_language}', '{movie_release_date}', '{movie_poster}', '{movie_trailer}'),\n"

#         # Remove the trailing comma and newline, then add a semicolon
#         formatted_sql = formatted_sql.replace("\n", "")
#         formatted_sql = formatted_sql.strip()

#         # Save the content to a file
#         with open('movie.sql', 'w', encoding='utf-8') as file:
#             file.write(formatted_sql)

#         print("SQL file saved as movie.sql")
#     except requests.exceptions.RequestException as e:
#         print(f"Error during requests: {e}")

# # Execute the function
# fetch_movie_data_and_save()
# Read the content of movies.sql

with open('movie.sql', 'r', encoding='utf-8') as file:
    sql_content = file.read()

# Replace \n with an empty string and remove trailing whitespace
cleaned_sql_content = sql_content.replace("\n", "").strip()

# Save the cleaned content back to movies.sql
with open('movies.sql', 'w', encoding='utf-8') as file:
    file.write(cleaned_sql_content)

print("Cleaned SQL content saved to movies.sql")