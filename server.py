"""Dev server with clean URLs and range request support for video seeking."""
import http.server
import os
import mimetypes

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve /foo as /foo.html if the file exists
        path = self.path.split('?')[0].split('#')[0]
        if '.' not in os.path.basename(path) and path != '/':
            html_path = path.lstrip('/') + '.html'
            if os.path.isfile(html_path):
                self.path = '/' + html_path

        # Handle range requests for video seeking
        range_header = self.headers.get('Range')
        if range_header:
            self.handle_range_request(range_header)
            return

        super().do_GET()

    def handle_range_request(self, range_header):
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            self.send_error(404)
            return

        file_size = os.path.getsize(path)
        # Parse "bytes=start-end"
        byte_range = range_header.replace('bytes=', '').strip()
        parts = byte_range.split('-')
        start = int(parts[0]) if parts[0] else 0
        end = int(parts[1]) if parts[1] else file_size - 1
        end = min(end, file_size - 1)
        length = end - start + 1

        content_type = mimetypes.guess_type(path)[0] or 'application/octet-stream'

        self.send_response(206)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
        self.send_header('Content-Length', str(length))
        self.send_header('Accept-Ranges', 'bytes')
        self.end_headers()

        with open(path, 'rb') as f:
            f.seek(start)
            self.wfile.write(f.read(length))

    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

if __name__ == '__main__':
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8081
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f'Serving from {os.getcwd()} at http://localhost:{port}')
    http.server.HTTPServer(('', port), CleanURLHandler).serve_forever()
