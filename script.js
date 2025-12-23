// mskü kordinatları
var map = L.map('map').setView([37.1670, 28.3710], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var nodesData = {};
var startNode = null;
var endNode = null;
var routeLine = null;

// JSON verisini yükleyip ve haritaya noktaları koy
fetch('graph-data.json')
    .then(response => response.json())
    .then(data => {

        nodesData = data.coordinates; 

        for (let nodeName in data.coordinates) {
            let lat = data.coordinates[nodeName][0];
            let lng = data.coordinates[nodeName][1];

            let marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup(nodeName);

            marker.on('click', function() {
                handleNodeClick(nodeName);
            });
        }
    })
    .catch(err => console.error("JSON yüklenemedi:", err));

function handleNodeClick(nodeName) {
    if (!startNode) {
        startNode = nodeName;
        document.getElementById('status').innerHTML = `Başlangıç: <b>${startNode}</b><br>Şimdi Hedefi Seçin.`;
    } else if (!endNode && nodeName !== startNode) {
        endNode = nodeName;
        document.getElementById('status').innerHTML = `Başlangıç: <b>${startNode}</b><br>Hedef: <b>${endNode}</b><br>Hesaplanıyor...`;

        calculateRoute(startNode, endNode);
    }
}

// bacend API bağlantısı
async function calculateRoute(start, end) {
    const url = `http://127.0.0.1:5000/api/shortest-path?start=${start}&end=${end}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "success") {
            drawPath(data.path);
            document.getElementById('status').innerHTML = `Yol Bulundu!<br>Mesafe: ${data.distance} birim`;
        } else {
            alert("Yol bulunamadı!");
        }
    } catch (error) {
        console.error("API Hatası:", error);
        alert("Python sunucusu çalışmıyor olabilir!");
    }
}

function drawPath(pathArray) {

    if (routeLine) map.removeLayer(routeLine);

    var latlngs = pathArray.map(node => nodesData[node]);

    routeLine = L.polyline(latlngs, {color: 'red', weight: 5}).addTo(map);
    
    map.fitBounds(routeLine.getBounds());
}

function resetMap() {
    startNode = null;
    endNode = null;
    if (routeLine) map.removeLayer(routeLine);
    document.getElementById('status').innerText = "Lütfen haritadan Başlangıç noktasını seçin.";
}
