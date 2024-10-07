import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const type = searchParams.get('type');

  if (!lat || !lon || !type) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: type,
        format: 'json',
        limit: 1,
        lat,
        lon,
      },
    });

    if (response.data && response.data.length > 0) {
      const nearest = response.data[0];
      return NextResponse.json({
        lat: parseFloat(nearest.lat),
        lon: parseFloat(nearest.lon),
        name: nearest.display_name,
      });
    } else {
      return NextResponse.json({ error: 'No results found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching nearest location:', error);
    return NextResponse.json({ error: 'Failed to fetch nearest location' }, { status: 500 });
  }
}