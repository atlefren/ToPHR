import json
from flask import Flask, render_template, request, jsonify

from scripts import generate as generate_tiles
from scripts import get_tilemill_projects

app = Flask(__name__)


@app.route('/')
def index():
    projects = get_tilemill_projects()
    return render_template('index.html', projects=json.dumps(projects))


@app.route('/example')
def example():
    return render_template('example.html')


@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    bounds = [float(a) for a in data.get('bounds').split(',')]
    min_zoom = data.get('minZoom')
    max_zoom = data.get('maxZoom')
    project = data.get('project')
    was_generated = generate_tiles(
        'export',
        bounds,
        min_zoom,
        max_zoom,
        project,
        project + '_from_web'
    )
    if was_generated:
        return jsonify(message='ok')
    return jsonify(message='oops!'), 500

if __name__ == '__main__':
    app.run(debug=True)
