from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from recommend import get_recommendations

app = Flask(__name__)
CORS(app)

@app.route('/api/recommendations', methods=['GET'])
def recommendations():
    try:
        artist = request.args.get('artist', '')
        if not artist:
            return jsonify({'error': 'Artist parameter is required'}), 400
        
        recommendations = get_recommendations(artist_name=artist)
        print(recommendations)
        
        # Convert response to JSON string and set charset to utf-8 explicitly
        response_data = jsonify({
            'success': True,
            'recommendations': recommendations
        })
        response_data.headers['Content-Type'] = 'application/json; charset=utf-8'
        
        return response_data
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
