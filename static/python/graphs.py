import pandas as pd
import numpy as np
import base64
import seaborn as sns
import matplotlib.pyplot as plt
from io import BytesIO

def generate_pokemon_stat_chart(pokemon_df, pokemon_name):
    """
    Generates a radar chart displaying base stats for a given Pokémon using Seaborn, and returns it as a base64-encoded image.
    """
    if not {"english_name", "hp", "attack", "defense", "sp_attack", "sp_defense", "speed", "primary_type", "secondary_type"}.issubset(pokemon_df.columns):
        raise ValueError("❌ Dataset is missing required columns.")

    pokemon_data = pokemon_df[pokemon_df["english_name"] == pokemon_name]
    if pokemon_data.empty:
        raise ValueError(f"❌ No matching Pokémon found for '{pokemon_name}'.")

    selected_stats = ["hp", "attack", "defense", "sp_attack", "sp_defense", "speed"]
    stat_values = pokemon_data[selected_stats].values.flatten()
    global_max = pokemon_df[selected_stats].max().max()

    type_colors = {
        "psychic": "#FF69B4", "fairy": "#FFD700", "fire": "#FF4500", "water": "#1E90FF", "grass": "#32CD32",
        "electric": "#FFD700", "ice": "#00FFFF", "fighting": "#8B0000", "poison": "#800080", "ground": "#DEB887",
        "flying": "#87CEEB", "bug": "#9ACD32", "rock": "#A52A2A", "ghost": "#4B0082", "dragon": "#00008B",
        "dark": "#2F4F4F", "steel": "#B0C4DE", "normal": "#A9A9A9"
    }

    # Use primary type color if available; otherwise, fallback to secondary type
    primary_type = pokemon_data["primary_type"].dropna().values
    secondary_type = pokemon_data["secondary_type"].dropna().values

    radar_color = type_colors.get(primary_type[0].lower(), "#A9A9A9") if primary_type.size > 0 else \
                  type_colors.get(secondary_type[0].lower(), "#A9A9A9") if secondary_type.size > 0 else "#A9A9A9"

    # Create radar chart
    angles = np.linspace(0, 2 * np.pi, len(selected_stats), endpoint=False).tolist()
    angles += angles[:1]  # Close the radar chart

    stat_values = np.append(stat_values, stat_values[0])  # Close the shape

    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    ax.fill(angles, stat_values, color=radar_color, alpha=0.4)  # Filled area
    ax.plot(angles, stat_values, color=radar_color, linewidth=2)  # Border line

    ax.set_yticks(np.linspace(0, global_max, num=5))
    ax.set_yticklabels([])  # Hide radial ticks
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(selected_stats, fontsize=14)  # **Larger stat labels**

    # Convert plot to base64
    image_bytes = BytesIO()
    plt.savefig(image_bytes, format="png", bbox_inches="tight")
    plt.close(fig)

    base64_image = base64.b64encode(image_bytes.getvalue()).decode("utf-8")
    return base64_image
