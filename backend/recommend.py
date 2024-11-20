import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity

# Load and preprocess data once when the module is imported
try:
    # Load dataset
    df = pd.read_csv("./songs.csv")

    # Specify numeric columns
    numeric_columns = [
        'Spotify Streams', 'YouTube Views', 'TikTok Views',
        'Apple Music Playlist Count', 'Pandora Streams', 'Shazam Counts'
    ]
    
    # Ensure all required numeric columns are present
    if not all(col in df.columns for col in numeric_columns):
        raise ValueError("Dataset missing required numeric columns.")

    # Handle missing values (fill with 0 for simplicity)
    df[numeric_columns] = df[numeric_columns].fillna(0)

    # Standardize numeric data
    scaler = StandardScaler()
    standardized_data = scaler.fit_transform(df[numeric_columns])

    # Calculate similarity matrix
    similarity_matrix = cosine_similarity(standardized_data)

except Exception as e:
    print(f"Error loading or processing data: {str(e)}")
    df = None
    similarity_matrix = None

def get_recommendations(artist_name: str, num_recommendations: int = 5) -> list:
    """
    Get music recommendations based on artist name
    
    Args:
        artist_name (str): Name of the artist
        num_recommendations (int): Number of recommendations to return
    
    Returns:
        list: List of dictionaries containing recommended tracks
    """
    try:
        if df is None or similarity_matrix is None:
            raise ValueError("Dataset or similarity matrix not properly initialized.")

        # Find artist indices (case-insensitive)
        artist_idx = df[
            df['Artist'].str.contains(artist_name, case=False, na=False)
        ].index
        
        if len(artist_idx) == 0:
            return []  # No matching artist found

        # Get similarity scores for the first matching artist
        similarity_scores = similarity_matrix[artist_idx[0]]
        
        # Get indices of top similar items (excluding the artist itself)
        similar_indices = similarity_scores.argsort()[::-1][1:num_recommendations+1]
        
        # Create recommendations list
        recommendations = []
        for idx in similar_indices:
            recommendations.append({
                'track': df.iloc[idx]['Track'],
                'artist': df.iloc[idx]['Artist'],
                'spotify_streams': int(df.iloc[idx]['Spotify Streams']),
                'youtube_views': int(df.iloc[idx]['YouTube Views'])
            })
        
        return recommendations

    except Exception as e:
        print(f"Error getting recommendations: {str(e)}")
        return []
