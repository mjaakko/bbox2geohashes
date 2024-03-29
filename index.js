//Converts a bounding box bounded by minLat and maxLat and minLng and maxLng to a list of geohashes (e.g. ["60;24/19/84", "60;24/19/85"]) used for MQTT topic filters
function bbox2geohashes(minLat, minLng, maxLat, maxLng) {
	var deltaLat = maxLat - minLat;
	var deltaLng = maxLng - minLng;

	var geohashLevel = Math.max(Math.ceil(Math.abs(Math.log10(deltaLat))), Math.ceil(Math.abs(Math.log10(deltaLng))));
        if (geohashLevel > 3) {
          geohashLevel = 3
        }
	var delta = Math.pow(10, -geohashLevel);

	var geohashes = [];

	var lat = truncate(minLat, geohashLevel);

	while(lat < maxLat) {
		var lng = truncate(minLng, geohashLevel);
		while(lng < maxLng) {
			geohashes.push(calculateGeohash(lat, lng, geohashLevel));
			lng += delta;
		}
		lat += delta;
	}

	return geohashes;
}

module.exports = bbox2geohashes

function calculateGeohash(lat, lng, level) {
	var geohash = Math.floor(lat)+";"+Math.floor(lng);

	for(var i = 0; i < level; i++) {
		geohash += "/";
		geohash += lat.toFixed(level + 1).split(".")[1][i];
		geohash += lng.toFixed(level + 1).split(".")[1][i];
	}

	return geohash;
}

function truncate(x, n) {
    if (n == 0) {
    	return x;
    }

    var split = x.toFixed(n+1).split(".");

    return parseFloat(split[0]+"."+split[1].substring(0, n));
}
