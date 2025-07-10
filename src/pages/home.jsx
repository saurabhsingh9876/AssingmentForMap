import React, { useEffect, useRef, useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api';
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const libraries = ['places'];

const MapRoute = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const originRef = useRef();
  const destinationRef = useRef();
  const mapRef = useRef();

  // Fetch user’s location and prefill origin
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const current = { lat: latitude, lng: longitude };
        setUserLocation(current);

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: current }, (res, status) => {
          if (status === 'OK' && res[0]) {
            setOrigin(res[0].formatted_address);
          } else {
            setOrigin('Mumbai, India');
          }
        });
      },
      () => setOrigin('Mumbai, India')
    );
  }, []);

  // Haversine formula to compute straight-line distance
  const computeDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth’s radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!origin || !destination) return alert('Both locations are required.');

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: origin }, (originRes, originStatus) => {
      if (originStatus !== 'OK' || !originRes[0]) {
        alert('Invalid origin.');
        return;
      }

      geocoder.geocode({ address: destination }, (destRes, destStatus) => {
        if (destStatus !== 'OK' || !destRes[0]) {
          alert('Invalid destination.');
          return;
        }

        const originLoc = originRes[0].geometry.location;
        const destLoc = destRes[0].geometry.location;

        const distanceKm = computeDistanceInKm(
          originLoc.lat(),
          originLoc.lng(),
          destLoc.lat(),
          destLoc.lng()
        );

        if (distanceKm > 1000) {
          alert('⚠️ Distance too far to map.');
          return;
        }

        setLoading(true);
        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode[travelMode],
          },
          (result, status) => {
            setLoading(false);
            if (status === 'OK') {
              setDirections(result);
              const leg = result.routes[0].legs[0];
              setDistance(leg.distance.text);
              setDuration(leg.duration.text);
            } else {
              alert(`Failed to get directions: ${status}`);
              setDirections(null);
              setDistance('');
              setDuration('');
            }
          }
        );
      });
    });
  };

  console.log("google api",import.meta.env.VITE_GOOGLE_API_KEY)
  const fetchCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = { lat: latitude, lng: longitude };
        setUserLocation(coords);

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: coords }, (res, status) => {
          if (status === 'OK' && res[0]) {
            setOrigin(res[0].formatted_address);
          }
        });
      },
      () => alert('Unable to fetch your current location.')
    );
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
      libraries={libraries}
    >
      <Box sx={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || { lat: 19.076, lng: 72.8777 }}
          zoom={10}
          onLoad={(map) => (mapRef.current = map)}
        >
          {userLocation && <Marker position={userLocation} title="You" />}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>

        {/* Floating Control Panel */}
        <Paper
          elevation={5}
          sx={{
            position: 'absolute',
            top: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            p: 3,
            minWidth: 350,
            borderRadius: 2,
            zIndex: 10,
            backdropFilter: 'blur(10px)',
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 15 }}
          >
            <Box display="flex" gap={1}>
              <Autocomplete
                onLoad={(ref) => (originRef.current = ref)}
                onPlaceChanged={() => {
                  const place = originRef.current.getPlace();
                  if (place?.formatted_address)
                    setOrigin(place.formatted_address);
                }}
              >
                <TextField
                  label="Origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  size="small"
                  fullWidth
                />
              </Autocomplete>
              <Button variant="outlined" size="small" onClick={fetchCurrentLocation}>
                📍
              </Button>
            </Box>

            <Autocomplete
              onLoad={(ref) => (destinationRef.current = ref)}
              onPlaceChanged={() => {
                const place = destinationRef.current.getPlace();
                if (place?.formatted_address)
                  setDestination(place.formatted_address);
              }}
            >
              <TextField
                label="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                size="small"
                fullWidth
              />
            </Autocomplete>

            <TextField
              select
              label="Travel Mode"
              value={travelMode}
              onChange={(e) => setTravelMode(e.target.value)}
              size="small"
              fullWidth
            >
              <MenuItem value="DRIVING">Driving</MenuItem>
              <MenuItem value="WALKING">Walking</MenuItem>
              <MenuItem value="BICYCLING">Bicycling</MenuItem>
              <MenuItem value="TRANSIT">Transit</MenuItem>
            </TextField>

            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Get Route'}
            </Button>
          </form>

          {distance && duration && (
            <Box mt={2}>
              <Typography variant="body2">
                <strong>Distance:</strong> {distance}
              </Typography>
              <Typography variant="body2">
                <strong>Duration:</strong> {duration}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </LoadScript>
  );
};

export default MapRoute;
