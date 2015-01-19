from flask import Flask, render_template, request, jsonify
from tiles import generate as generate_tiles

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/example')
def example():
    return render_template('example.html')


@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    bounds = [float(a) for a in data.get('bounds').split(',')]
    min_zoom = data.get('minZoom')
    max_zoom = data.get('maxZoom')
    was_generated = generate_tiles(
        'export',
        bounds,
        min_zoom,
        max_zoom,
        'world',
        'world_from_web'
    )
    if was_generated:
        return jsonify(message='ok')
    return jsonify(message='oops!'), 500

if __name__ == '__main__':
    app.run(debug=True)
