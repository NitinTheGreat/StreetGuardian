import axios from 'axios';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const type = searchParams.get('type'); // e.g. hospital, police station

    if (!lat || !lon || !type) {
      return new Response(JSON.stringify({ error: 'Invalid parameters' }), { status: 400 });
    }

    // Nominatim API query
    const params = {
      format: 'json',
      lat,
      lon,
      amenity: type,
      radius: 5000, // 5km radius
      limit: 1,
      bounded: 1
    };

    const response = await axios.get('https://nominatim.openstreetmap.org/search', { params });

    if (response.data.length === 0) {
      return new Response(JSON.stringify({ error: 'No nearby locations found' }), { status: 404 });
    }

    // Extract required information
    const nearest = response.data[0];
    const nearestLocation = {
      lat: nearest.lat,
      lon: nearest.lon,
      name: nearest.display_name
    };

    return new Response(JSON.stringify(nearestLocation), { status: 200 });
  } catch (error) {
    console.error('Error fetching nearest location:', error);
    return new Response(JSON.stringify({ error: 'Error fetching nearest location' }), { status: 500 });
  }
}
