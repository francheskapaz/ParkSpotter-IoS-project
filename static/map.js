// Set the map view coordinates and zoom
var map = L.map('map').setView([46.066667, 11.116667], 14);

// Get the map data from openstreetmap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Icons
var defaultIcon = L.icon({ iconUrl: 'images/default.svg', iconSize: [38, 95], iconAnchor: [20, 70] });
var carIconBlue = L.icon({ iconUrl: 'images/carblue.svg', iconSize: [38, 95], iconAnchor: [20, 70] });
var carIconGreen = L.icon({ iconUrl: 'images/cargreen.svg', iconSize: [38, 95], iconAnchor: [20, 70] });
var carIconYellow = L.icon({ iconUrl: 'images/caryellow.svg', iconSize: [38, 95], iconAnchor: [20, 70] });
var carIconRed = L.icon({ iconUrl: 'images/carred.svg', iconSize: [38, 95], iconAnchor: [20, 70] });
var bikeIconBlue = L.icon({ iconUrl: 'images/bikeblue.svg', iconSize: [38, 95], iconAnchor: [20, 70] });
var bikeIconGreen = L.icon({ iconUrl: 'images/bikegreen.svg', iconSize: [38, 95], iconAnchor: [20, 70] });
var bikeIconYellow = L.icon({ iconUrl: 'images/bikeyellow.svg', iconSize: [38, 95], iconAnchor: [20, 70] });
var bikeIconRed = L.icon({ iconUrl: 'images/bikered.svg', iconSize: [38, 95], iconAnchor: [20, 70] });
var motorbikeIconBlue = L.icon({ iconUrl: 'images/motorbikeblue.svg', iconSize: [38, 95], iconAnchor: [20, 70] });
var motorbikeIconGreen = L.icon({ iconUrl: 'images/motorbikegreen.svg', iconSize: [38, 95], iconAnchor: [20, 70] });
var motorbikeIconYellow = L.icon({ iconUrl: 'images/motorbikeyellow.svg', iconSize: [38, 95], iconAnchor: [20, 70] });
var motorbikeIconRed = L.icon({ iconUrl: 'images/motorbikered.svg', iconSize: [38, 95], iconAnchor: [20, 70] });

// Keep track of the markers
var carMarkers = Array();
var bikeMarkers = Array();
var motorbikeMarkers = Array();

function showCars() {
    // Fetch parkings from API and display them on the map
    fetch('/api/v1/parkings')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            for (const parking of data) {
                if (parking.vehicleType.toLowerCase() !== 'car') continue;

                // Select the icon
                var icon = defaultIcon;
                if (typeof parking.nFree !== 'number') icon = carIconBlue;
                else if (parking.nFree / parking.nParkingSpaces > 0.2) icon = carIconGreen;   // More than 20% are free
                else if (parking.nFree / parking.nParkingSpaces > 0.05) icon = carIconYellow; // 5% to 20% are free
                else if (parking.nFree / parking.nParkingSpaces <= 0.05) icon = carIconRed;   // Less than 5% are free

                // Add marker
                var m = L.marker([parking.coordinates.nord, parking.coordinates.est], { icon: icon })
                    // .on('click', () => {
                    //     document.location = '/api/v1/parkings/' + parking.id;
                    // })
                    .addTo(map);
                carMarkers.push(m);
            }
        });
}

function showBikes() {
    // Fetch parkings from API and display them on the map
    fetch('/api/v1/parkings')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            for (const parking of data) {
                if (parking.vehicleType.toLowerCase() !== 'bike') continue;

                // Select the icon
                var icon = defaultIcon;
                if (typeof parking.nFree !== 'number') icon = bikeIconBlue;
                else if (parking.nFree / parking.nParkingSpaces > 0.2) icon = bikeIconGreen;
                else if (parking.nFree / parking.nParkingSpaces > 0.05) icon = bikeIconYellow;
                else if (parking.nFree / parking.nParkingSpaces <= 0.05) icon = bikeIconRed;

                // Add marker
                var m = L.marker([parking.coordinates.nord, parking.coordinates.est], { icon: icon })
                    .on('click', () => {
                        document.location = '/api/v1/parkings/' + parking.id;
                    })
                    .addTo(map);
                bikeMarkers.push(m);
            }
        });
}

function showMotorbikes() {
    // Fetch parkings from API and display them on the map
    fetch('/api/v1/parkings')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            for (const parking of data) {
                if (parking.vehicleType.toLowerCase() !== 'motorbike') continue;

                // Select the icon
                var icon = defaultIcon;
                if (typeof parking.nFree !== 'number') icon = motorbikeIconBlue;
                else if (parking.nFree / parking.nParkingSpaces > 0.2) icon = motorbikeIconGreen;
                else if (parking.nFree / parking.nParkingSpaces > 0.05) icon = motorbikeIconYellow;
                else if (parking.nFree / parking.nParkingSpaces <= 0.05) icon = motorbikeIconRed;

                // Add marker
                var m = L.marker([parking.coordinates.nord, parking.coordinates.est], { icon: icon })
                    .on('click', () => {
                        document.location = '/api/v1/parkings/' + parking.id;
                    })
                    .addTo(map);
                motorbikeMarkers.push(m);
            }
        });
}

function hideCars() {
    for (const m of carMarkers) {
        m.remove()
    }
}

function hideBikes() {
    for (const m of bikeMarkers) {
        m.remove()
    }
}

function hideMotorbikes() {
    for (const m of motorbikeMarkers) {
        m.remove()
    }
}

