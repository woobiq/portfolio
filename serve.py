#!/usr/bin/env python3
"""Dev server with clean URLs: /projects serves projects.html"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Strip query string
        path = path.split('?')[0].split('#')[0]
        # Build filesystem path
        fs_path = os.path.join(ROOT, path.lstrip('/'))
        # If no extension and not a directory, try .html
        if not os.path.exists(fs_path) and '.' not in os.path.basename(path):
            html_path = fs_path + '.html'
            if os.path.isfile(html_path):
                return html_path
        return fs_path

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8081
print(f'Serving {ROOT} on http://localhost:{port} (threaded)')
ThreadingHTTPServer(('', port), Handler).serve_forever()
