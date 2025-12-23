from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import heapq

app = Flask(__name__)

CORS(app)


def load_graph_data(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
    return data

def dijkstra(graph_data, start_node, end_node):

    edges = graph_data.get("edges", {})

    pq = [(0, start_node, [start_node])]
    visited = set()

    while pq:
        current_distance, current_node, path = heapq.heappop(pq)

        if current_node == end_node:
            return {
                "path": path,
                "distance": current_distance,
                "status": "success"
            }

        if current_node in visited:
            continue
        visited.add(current_node)

        neighbors = edges.get(current_node, [])

        for neighbor in neighbors:
            neighbor_name = neighbor["node"]
            weight = neighbor["weight"]

            if neighbor_name not in visited:
                new_distance = current_distance + weight
                new_path = path + [neighbor_name]
                heapq.heappush(pq, (new_distance, neighbor_name, new_path))

    return {"status": "failure", "message": "Yol bulunamadı."}

FILE_PATH = r'.\AI-Final\graph-data.json'

try:
    print(f"Veri yükleniyor: {FILE_PATH} ...")
    global_graph_data = load_graph_data(FILE_PATH)
    print("Veri başarıyla yüklendi!")
except Exception as e:
    print(f" Veri dosyası yüklenemedi! Hata kodu: {e}")
    global_graph_data = {}

@app.route('/api/shortest-path', methods=['GET'])
def get_shortest_path():
    start_node = request.args.get('start')
    end_node = request.args.get('end')

    if not start_node or not end_node:
        return jsonify({"status": "error", "message": "Lütfen start ve end parametrelerini gönderin."}), 400

    if not global_graph_data:
        return jsonify({"status": "error", "message": "Sunucu hatası: Graph verisi yüklenemedi."}), 500

    result = dijkstra(global_graph_data, start_node, end_node)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
