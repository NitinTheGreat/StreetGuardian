import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return new Response(JSON.stringify({ message: "Token missing" }), {
        status: 400,
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    return new Response(JSON.stringify({ valid: true, decoded }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Invalid or expired token", error }),
      { status: 401 }
    );
  }
}
