import json
import os
from subprocess import Popen, PIPE

from compute_tiles import get_covering_tiles


class TileMillException(Exception):
    pass


def create_tilemill_file(filename, tiles):
    with open(filename, 'w') as f:
        for tile in tiles:
            f.write('%s\n' % json.dumps(tile))


def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)


def find_filename(lines):
    str = 'found previous export with same name, so renamed to: '
    for line in lines:
        if str in line:
            return line.replace(str, '').strip()
    return None


def generate(export_dir, bounds, min_zoom, max_zoom, project, name):
    export_dir = export_dir + '/'
    ensure_dir(export_dir)
    export_dir = export_dir + name + '/'
    ensure_dir(export_dir)

    tiles = get_covering_tiles(bounds, min_zoom, max_zoom)

    filelist_name = export_dir + name + '_tiles.json'
    create_tilemill_file(filelist_name, tiles)

    out_file = export_dir + name + '.mbtiles'
    p = Popen([
        'node',
        '/usr/share/tilemill/index.js',
        'export',
        project,
        out_file,
        '--scheme=file',
        '--list=' + filelist_name,
        '--verbose=off'
    ], stdin=PIPE, stdout=PIPE, stderr=PIPE)

    lines = []
    for line in iter(p.stdout.readline, ''):
        lines.append(line)

    p.wait()

    if p.returncode != 0:
        raise TileMillException

    new_filename = find_filename(lines)
    if new_filename:
        return export_dir + new_filename
    return out_file


def generate_mbtiles(config, export_dir):
    bounds = config.get('bounds', None)
    min_zoom = config.get('minZoom', None)
    max_zoom = config.get('maxZoom', None)
    project = config.get('tmProject', None)
    name = config.get('name', project)
    generate(export_dir, bounds, min_zoom, max_zoom, project, name)


def get_tilemill_projects():
    home = os.path.expanduser("~")
    projects_path = home + '/Documents/MapBox/project/'
    projects = [name for name in os.listdir(projects_path)
                if os.path.isdir(os.path.join(projects_path, name))]
    return sorted(projects)
