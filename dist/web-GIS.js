//fullscreeen map view
var mapId = document.getElementById('map');
function fullScreenView(){
    mapId.requestFullscreen();
}

//map print
$('.print-map').click(function(){
    window.print();
});
L.control.browserPrint().addTo(map);

//leaflet measure
L.control.measure({
    primaryLengthUnit: 'kilometers',
    secondaryLengthUnit: 'meters',
    primaryAreaUnit: 'sqmeters',
    secondaryAreaUnit: undefined,
    position:'topleft',
    activeColor: '#ff0000',
    completedColor: '#ff0000'
}).addTo(map);


//leaflet search
L.Control.geocoder({
    position:'topleft'
}).addTo(map);

//zoom to layer
$('.zoom-to-layer').click(function(){
    map.setView([-8.619869, 115.213096], 10)
})