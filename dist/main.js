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

let circle, search_marker

//adding marker to the map from geojson data
var markers = L.markerClusterGroup({
	spiderfyOnMaxZoom: true,
});

var markerlist = {};

var propt = L.geoJson(db1, {
	pointToLayer: function(feature, latlng){
		let m = L.marker(latlng).bindPopup("<h1 class='infoHeader'> Info </h1> <p class = 'infoHeader'>" + feature.properties.Judul + "</p>"
		+ "<br>" + "<b>" + "Harga : " + "</b>" + feature.properties.Harga +"</br>"
		+ "<br>" + "<b>" + "LB : " + "</b>" + feature.properties.LuasBangunan +"</br>"
		+ "<br>" + "<b>" + "LT : " + "</b>" + feature.properties.LuasTanah +"</br>"
		+ "<br>" + "<b>" + "Penjual : " + "</b>" + feature.properties.Penjual +"</br>"
		+ "<br>" + "<b>" + "Kontak : " + "</b>" + feature.properties.Telpon +"</br>"
		+ "<br>" + "<b>" + "Deskripsi : " + "</b>" + feature.properties.Deskripsi + "</br>"
		+ "<br>" + "<b>" + "Laman Web : " + "</b>" + feature.properties.Url + "</br>");
		let joinCoord = latlng.lat+"-"+latlng.lng;
		markerlist[joinCoord] = m;
		return m;
	}
});

propt.addTo(markers);
markers.addTo(map);
// propt.addTo(map);
// markers.addLayer(propt).addTo(map);
// marker.addTo(map);

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

	map.setView(new L.LatLng(lat, lng), 16);
	
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
			if (distance_from_layer_circle <= radius) {
				counter_points_in_circle += 1;
				let onclickEvt = `onclick="centremap(${layer_lat_long.lat},${layer_lat_long.lng})"`;
				let onmouseOvrOut = `onmouseover="pick(${layer.feature.properties.adId})" onmouseout="pick1(${layer.feature.properties.adId})"`;

				// markers.removeLayer(distance_from_layer_circle);
				// distance_from_layer_circle.addTo(map)
				// 	.openPopup();
	
				// map.on('popupclose', function(){
				// 	markers.addLayer(distance_from_layer_circle);
				// 	map.removeLayer(distance_from_layer_circle);
				// });

				if (layer.feature.properties.LuasBangunan == " "){
					var ofi_paf_html = `
					<li class="property" id="ofi_paf-${layer.feature.properties.adId}" ${onmouseOvrOut} ${onclickEvt}>
					<h3 class="property_title">${counter_points_in_circle}. ${layer.feature.properties.Judul}</h3>
					<div class="property_details">
					  <span class="Luas Tanah">Luas Tanah : ${layer.feature.properties.LuasTanah} m2</span><br>
					  <span class="Harga">Harga : ${layer.feature.properties.Harga}</span><br>
					  <span class="Jarak">Jarak :  ${(distance_from_layer_circle*0.001).toFixed(2)} km </span><br>
					</div>`
					
				}else{
					var ofi_paf_html = `
					<li class="property" id="ofi_paf-${layer.feature.properties.adId}" ${onmouseOvrOut} ${onclickEvt}>
					<h3 class="property_title">${counter_points_in_circle}. ${layer.feature.properties.Judul}</h3>
					<div class="property_details">
					  <span class="Luas Bangunan">Luas Bangunan : ${layer.feature.properties.LuasBangunan} m2 </span><br> 
					  <span class="Luas Tanah">Luas Tanah : ${layer.feature.properties.LuasTanah} m2</span><br>
					  <span class="Harga">Harga : ${layer.feature.properties.Harga}</span><br>
					  <span class="Jarak">Jarak :  ${(distance_from_layer_circle*0.001).toFixed(2)} km </span><br>
					</div>`
				}
				$('#ofi_paf').append(ofi_paf_html);
			};
		});
		$('#ofi_paf_results').html(counter_points_in_circle);
	}
}
function pick(id){
	var picks = document.getElementById("ofi_paf-"+id);
	picks.style.color = 'blue';
}

function pick1(id){
	var picks1 = document.getElementById("ofi_paf-"+id);
	picks1.style.color = 'black';
}

function openPopUp(id, clusterId){
	map.closePopup();
	map.eachLayer(function(layer){
		if(layer._leaflet_id == clusterId){
			layer.spiderfy();
		}
	});
	map.eachLayer(function(layer){
		if(layer._leaflet_id == id){
			layer.openPopup();
		}
	});
}

markers.on('clusterclick', function(a){
	if(a.layer._zoom == 18){
		popUpText = '<ul>';
		//there are many markers inside "a". to be exact: a.layer._childCount much ;-)
		//let's work with the data:
		for (feat in a.layer._markers){
			popUpText+= '<li><u onclick=openPopUp(' + a.layer._markers[feat]._leaflet_id + ','+ a.layer._leaflet_id +')>' + a.layer._markers[feat].feature.properties['Judul'] + '</u></li>';
		}
		popUpText += '</ul>';
		//as we have the content, we should add the popup to the map add the coordinate that is inherent in the cluster:
		var popup = L.popup().setLatLng([a.layer._cLatLng.lat, a.layer._cLatLng.lng]).setContent(popUpText).openOn(map); 
	}
})

function centremap(lat,lng){
	map.panTo(new L.LatLng(lat, lng));
	let joinCoord = lat+"-"+lng;
	let m = markerlist[joinCoord];
	m.fire('click')
}

document.getElementById("getLocation").addEventListener("click",getLocation);

////////////////////////////////////////////////////////////////////////////////
