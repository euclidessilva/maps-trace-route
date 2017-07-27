var directionDisplay, map;
var directionsService = new google.maps.DirectionsService();


function inicializar() {
	var latlng = new google.maps.LatLng(-23.5134242, -46.6946044);
	var rendererOptions = {
		draggable : true
	};
	directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
	var myOptions = {
		zoom : 13,
		center : latlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		mapTypeControl : false
	};
	map = new google.maps.Map(document.getElementById("mapa"), myOptions);
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("direcoes"));
	carregarPontos();
}

function carregarPontos() {

	$.getJSON('js/pontos.json', function(pontos) {

		$.each(pontos, function(index, ponto) {
			var marker = new google.maps.Marker({
				position : new google.maps.LatLng(ponto.Latitude,
						ponto.Longitude),
				title : "Marcador",
				map : map,
				icon : 'img/marcador.png'
			});
			var infowindow = new google.maps.InfoWindow(), marker;
			google.maps.event.addListener(marker, 'click',
					(function(marker, i) {
						return function() {
							infowindow.setContent("Unidade gerdau");
							infowindow.open(map, marker);
						}
					})(marker))
		});
	});
}
function calcularRota() {
	var modo = $('input[name="modo"]:checked').val();
	var inicio = $('input[name="gerdau"]:checked').val();
	var fim = $("#fimm").val();
	var tamanho = $("#fimm").val().length;
	$('#erro').hide();
	
	if (($.isNumeric(fim)) && (tamanho != 8)) {
		$('#direcoes').empty();
	    $('#erro').show();
		$('#erro').text("Formato invalido");	
	}
	
	var request = {
		origin : inicio,
		destination : fim,
		unitSystem : google.maps.UnitSystem.METRIC,
		travelMode : google.maps.DirectionsTravelMode[modo]
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			$('#direcoes').empty();
			directionsDisplay.setDirections(response);
		}
	});
}