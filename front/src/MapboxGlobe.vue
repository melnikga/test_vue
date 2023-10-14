<template>
    <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import 'mapbox-gl/dist/mapbox-gl.css';
import { onMounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl'; 
 

export default {
        
    
    setup() {
        
        const mapContainer = ref(null);
        mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';
        
        onMounted(async () => {
            let plots = [];
            const response = await fetch("http://localhost:1337/api/plots?populate=dots").then(res => res.json());
            plots = response.data;
            console.log(plots);
            
            const map = new mapboxgl.Map({
                container: mapContainer.value, 
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [30.335263, 59.930561],
                zoom: 14,
            });

            plots.forEach((plot, index) => {
                const coordinates = [];
                plot.attributes.dots.data.forEach(item=> {
                    coordinates.push([item.attributes.longitude, item.attributes.latitude])
                })

                coordinates.forEach(coord => new mapboxgl.Marker().setLngLat(coord).addTo(map));

                const polygonId = 'polygon-' + index;

                map.on('load', () => {
                    if (map.getSource(polygonId)) {
                    map.removeSource(polygonId);
                    map.removeLayer(polygonId);
                    }

                    map.addSource(polygonId, {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'geometry': {
                        'type': 'Polygon',
                        'coordinates': [coordinates]
                        }
                    }
                    });

                    map.addLayer({
                    'id': polygonId,
                    'type': 'fill',
                    'source': polygonId,
                    'layout': {},
                    'paint': {
                        'fill-color': '#888', // Цвет заливки
                        'fill-opacity': 0.4 // Прозрачность
                    }
                    });
                });

                map.on('style.load', () => {
                    map.setFog({});
                });
                
            })

        });

        return {
            mapContainer,
        };
    },
};

</script>

<style scoped>
.map-container{
    width: 500px;
    height: 800px;
    background: red;
}
</style>