    //map class initialize
var map = L.map('map').setView([-8.631812, 115.201907], 10);

L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 18,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

    //add map scale
L.control.scale().addTo(map);

//map coordinate display
map.on('mousemove', function(e){
    $('.coordinate').html(`Lat: ${e.latlng.lat} Lng: ${e.latlng.lng}`)
})

function info(feature, layer){
    layer.bindPopup(
		"<h1 class='infoHeader'> Info </h1> <p class = 'infoHeader'>" + feature.properties.Judul + "</p>"
		+ "<br>" + "<b>" + "Harga : " + "</b>" + feature.properties.Harga +"</br>"
		+ "<br>" + "<b>" + "LB : " + "</b>" + feature.properties.LuasBangunan +"</br>"
		+ "<br>" + "<b>" + "LT : " + "</b>" + feature.properties.LuasTanah +"</br>"
		+ "<br>" + "<b>" + "Penjual : " + "</b>" + feature.properties.Penjual +"</br>"
		+ "<br>" + "<b>" + "Kontak : " + "</b>" + feature.properties.Telpon +"</br>"
		+ "<br>" + "<b>" + "Deskripsi : " + "</b>" + feature.properties.Deskripsi + "</br>"
		+ "<br>" + "<b>" + "Laman Web : " + "</b>" + feature.properties.Url + "</br>"
		);
};

let circle, search_marker

//adding marker to the map from geojson data
var marker = L.markerClusterGroup();

var propt = L.geoJson(db1, {
	onEachFeature: info,
	pointToLayer: function(feature, latlng){
		return L.marker(latlng);
	}
}).addTo(marker);
marker.addTo(map);

function kmToMeters(km) {
	return km * 1000;
};

function getLocation(){
	var lat = document.getElementById("latitude").value;
	var lng = document.getElementById("longitude").value;
	var radius = kmToMeters($('#radius-selected').val());

	if(circle) {
        map.removeLayer(circle);
    }

	if (search_marker) {
        map.removeLayer(search_marker);
    }

	map.setView(new L.LatLng(lat, lng), 15);
	
	search_marker = L.marker([lat, lng]).addTo(map)
						.bindPopup('Lokasi yang Dicari')
						.openPopup();

	circle = L.circle({lat:lat, lng:lng},{
				color: 'steelblue',
				radius: radius,
				fillColor: 'steelblue',
				opacity: 0.3}).addTo(map)
	//menghapus isi informasi sebelum dijalankan ulang
	$('#ofi_paf').html('');
	
	//menghitung hasil marker dalam radius
	if (circle !== undefined){
		circle_lat_long = circle.getLatLng();
		var counter_points_in_circle = 0;

		propt.eachLayer(function(layer){
			layer_lat_long = layer.getLatLng();
			
			distance_from_layer_circle = layer_lat_long.distanceTo(circle_lat_long);
			
			//menampilkan informasi d dalam radius
			var coords = []
			if (distance_from_layer_circle <= radius) {
				counter_points_in_circle += 1;

				if (layer.feature.properties.LuasBangunan == " "){
					var ofi_paf_html = `
					<li class="property">
					<h3 class="property_title">${counter_points_in_circle}. ${layer.feature.properties.Judul}</h3>
					<div class="property_details">
					  <span class="Luas Tanah">Luas Tanah : ${layer.feature.properties.LuasTanah} m2</span><br>
					  <span class="Harga">Harga : ${layer.feature.properties.Harga}</span><br>
					  <span class="Jarak">Jarak :  ${(distance_from_layer_circle*0.001).toFixed(2)} km </span><br>
					</div>`
					
				}else{
					var ofi_paf_html = `
					<li class="property">
					<h3 class="property_title">${counter_points_in_circle}. ${layer.feature.properties.Judul}</h3>
					<div class="property_details">
					  <span class="Luas Bangunan">Luas Bangunan : ${layer.feature.properties.LuasBangunan} m2 </span><br> 
					  <span class="Luas Tanah">Luas Tanah : ${layer.feature.properties.LuasTanah} m2</span><br>
					  <span class="Harga">Harga : ${layer.feature.properties.Harga}</span><br>
					  <span class="Jarak">Jarak :  ${(distance_from_layer_circle*0.001).toFixed(2)} km </span><br>
					</div>`

				}

				$('#ofi_paf').append(`<li> ${ofi_paf_html} </li>`);
				// $('ul').on('click','li',moveToPopup());
			}
			})
		};
		$('#ofi_paf_results').html(counter_points_in_circle);
	}

function pick(){
	var picks = document.getElementById("ofi_paf_container");
	picks.style.color = 'blue';
}

function pick1(){
	var picks1 = document.getElementById("ofi_paf_container");
	picks1.style.color = 'black';
}

document.getElementById("getLocation").addEventListener("click",getLocation);

/////////////////////////////////////////////////////////////////////////////////