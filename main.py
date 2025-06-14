from livereload import Server
from flask import Flask, Response, make_response, render_template, url_for

import pandas as pd
import numpy as np

import os 
import re
from itertools import permutations

alternative_sprite = "nav_logo/pokeball.png"
template_folder = "templates/"
csv_file = "static/pokemon.csv"
static_folder = "static"
sprite_folder = f"{static_folder}/pokemon"

app = Flask(__name__, template_folder=template_folder, static_folder="static", static_url_path="/")

listdir = pd.DataFrame(os.listdir(sprite_folder), columns=["Filename"])

def get_permutations(arr):
    return [list(p) for p in permutations(arr)]


@app.template_filter('is_empty')
def is_empty(value):
    return pd.isna(value) or value == ""

@app.template_filter('type_badge')
def type_badge(pokemon_type):
    if pd.isna(pokemon_type) or pokemon_type == "":
        return ""

    color_map = {
        'normal': '#A8A77A',
        'fire': '#EE8130',
        'water': '#6390F0',
        'electric': '#F7D02C',
        'grass': '#7AC74C',
        'ice': '#96D9D6',
        'fighting': '#C22E28',
        'poison': '#A33EA1',
        'ground': '#E2BF65',
        'flying': '#A98FF3',
        'psychic': '#F95587',
        'bug': '#A6B91A',
        'rock': '#B6A136',
        'ghost': '#735797',
        'dragon': '#6F35FC',
        'dark': '#705746',
        'steel': '#B7B7CE',
        'fairy': '#D685AD'
    }

    lower_type = pokemon_type.strip().lower()
    color = color_map.get(lower_type, '#777')  # default gray

    return f'<span style="background-color:{color}; padding:2px 6px; border-radius:6px; color:white;">{pokemon_type.capitalize()}</span>'

    
# --------------------------------------------------------------------------

# def clean_and_sort(name):
#     """Removes numbers, special characters, lowers case, splits by spaces, and sorts words."""
#     clean_name = ''.join([char for char in name if char.isalnum() or char == " "]).lower().split()
#     return sorted(clean_name)

# @app.template_filter('image_match')
# def image_match(pokemon_name):
#     """Matches Pokémon names with image files, ensuring variants and evolutions are recognized."""
#     sprite_folder = "static/pokemon_sprites/"
    
#     target_words = clean_and_sort(pokemon_name)
#     best_match = None

#     # First-pass: Strict match
#     for file in os.listdir(sprite_folder):
#         filename_clean = clean_and_sort(file.replace(".png", "").replace(".jpg", ""))
#         if target_words == filename_clean:
#             best_match = file
#             break

#     # Second-pass: Soft match (allows extra words in filename)
#     if not best_match:
#         for file in os.listdir(sprite_folder):
#             filename_clean = clean_and_sort(file.replace(".png", "").replace(".jpg", ""))
#             if all(word in filename_clean for word in target_words):
#                 best_match = file
#                 break

#     # Third-pass: Check for evolved forms
#     if not best_match:
#         for file in os.listdir(sprite_folder):
#             filename_clean = clean_and_sort(file.replace(".png", "").replace(".jpg", ""))
#             if any(word in filename_clean for word in target_words):  # Check if any word exists
#                 best_match = file
#                 break

#     # If still no match, return a default placeholder
#     return f"pokemon_sprites/{best_match}" if best_match else "nav_logo/pokeball.png"

# # Register filter manually
# app.jinja_env.filters["image_match"] = image_match

# --------------------------------------------------------------------------

@app.template_filter('image_match')
def image_match(pokemon_name):

    sanitize_file = [
        (i, list(reversed(re.sub(r'[^a-zA-Z\s.]', '', i).removesuffix(".png").lower().split())))
        for i in listdir['Filename']
    ]
    sanitize_name = list(reversed(re.sub(r'[^a-zA-Z\s.]', '', pokemon_name).lower().split()))

    for original, sanitized in sanitize_file:
        for file_perm in get_permutations(sanitized): 
            if sanitize_name == file_perm:
                return f"{sprite_folder}/{original}".removeprefix(static_folder)
            
    return alternative_sprite
            

    

# Register filter manually
app.jinja_env.filters["image_match"] = image_match

@app.route('/')
def index():
    pokemon_df = pd.read_csv(csv_file)

    return render_template("index.html", pokemon_df=pokemon_df)

if __name__ == '__main__':

    server = Server(app.wsgi_app)
    server.watch(template_folder)
    server.watch(static_folder)
    server.serve(debug=True, host='0.0.0.0', port=5000)


# if __name__ == '__main__':
#     app.run(debug=True, host="0.0.0.0", port=8000, use_reloader=True)
