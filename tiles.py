import os
import sys
import getopt
import json

from scripts import generate_mbtiles


def read_json_file(filename):
    with open(filename, 'r') as f:
        return json.loads(f.read())


def parse_params(argv):
    configfile = 'config.json'
    outputdir = 'export'
    usage = 'tiles.py -c <config.json> -o <output_directory>'
    try:
        opts, args = getopt.getopt(argv, 'hc:o:', ['config=', 'odir='])
    except getopt.GetoptError:
        print usage
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print usage
            sys.exit()
        elif opt in ('-c', '--config'):
            configfile = arg
        elif opt in ('-o', '--odir'):
            outputdir = arg
    return configfile, outputdir


if __name__ == '__main__':
    os.environ['NODE_ENV'] = 'production'
    configfile, outputdir = parse_params(sys.argv[1:])
    config = read_json_file(configfile)
    generate_mbtiles(config, outputdir)
