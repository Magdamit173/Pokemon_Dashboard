from livereload import Server
from flask import Flask, Response, make_response, render_template, url_for, request, jsonify

import pandas as pd
import numpy as np

import os 
import re
import base64
from itertools import permutations 

from static.python.graphs import generate_pokemon_stat_chart # sensitive dont move the graphs.py randomly at all


alternative_sprite = "nav_logo/pokeball.png"
template_folder = "templates/"
csv_file = "static/pokemon.csv"
static_folder = "static"
sprite_folder = f"{static_folder}/pokemon_sprites"

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



# -------------------------------------------------------------------------

@app.route("/type-badge")
def type_badge():
    """
    Flask route to return a Pokémon type badge as an HTML-styled string.
    Expects a query parameter 'pokemon_type'.
    """
    pokemon_type = request.args.get("pokemon_type", "").strip().lower()

    if not pokemon_type:
        return "❌ Missing 'pokemon_type' parameter.", 400

    color_map = {
        'normal': '#A8A77A', 'fire': '#EE8130', 'water': '#6390F0',
        'electric': '#F7D02C', 'grass': '#7AC74C', 'ice': '#96D9D6',
        'fighting': '#C22E28', 'poison': '#A33EA1', 'ground': '#E2BF65',
        'flying': '#A98FF3', 'psychic': '#F95587', 'bug': '#A6B91A',
        'rock': '#B6A136', 'ghost': '#735797', 'dragon': '#6F35FC',
        'dark': '#705746', 'steel': '#B7B7CE', 'fairy': '#D685AD'
    }

    color = color_map.get(pokemon_type, '#777')  # Default gray for unknown types
    badge_html = f'<span style="background-color:{color}; padding:2px 6px; border-radius:6px; color:white; height: 100%; width: 100%">{pokemon_type.capitalize()}</span>'

    return badge_html
    
# -------------------------------------------------------------------------

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

# -------------------------------------------------------------------------

@app.route("/image_match")
def image_match():
    identifier = request.args.get("identifier", "").strip().lower()
    
    if not identifier:
        image_path = alternative_sprite
    else:
        sanitize_file = [
            (i, list(reversed(re.sub(r'[^a-zA-Z\s.]', '', i).removesuffix(".png").lower().split())) )
            for i in listdir["Filename"]
        ]
        sanitize_name = list(reversed(re.sub(r'[^a-zA-Z\s.]', '', identifier).lower().split()))

        image_path = alternative_sprite
        for original, sanitized in sanitize_file:
            for file_perm in get_permutations(sanitized): 
                if sanitize_name == file_perm:
                    image_path = f"{sprite_folder}/{original}"
                    break

    with open(image_path, "rb") as image_file:
        encoded = base64.b64encode(image_file.read()).decode("utf-8")

    return f"data:image/png;base64,{encoded}"

# -------------------------------------------------------------------------

@app.route("/pokemon-chart")
def pokemon_chart():
    """
    Flask route to generate a Pokémon radar chart and return it directly as a base64 image.
    Expects a query parameter 'pokemon_name'.
    """
    pokemon_name = request.args.get("pokemon_name")
    pokemon_df = pd.read_csv(csv_file)

    if not pokemon_name:
        return "❌ Missing 'pokemon_name' parameter.", 400

    try:
        # Assume pokemon_df is already loaded globally
        encoded_image = generate_pokemon_stat_chart(pokemon_df, pokemon_name)
        return f"data:image/png;base64,{encoded_image}"  # Returning directly
    except ValueError as e:
        return f"❌ {str(e)}", 404
    except Exception as e:
        return f"⚠️ Internal Server Error: {str(e)}", 500


# -------------------------------------------------------------------------

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
