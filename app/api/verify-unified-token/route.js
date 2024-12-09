import jwt from "jsonwebtoken";

const USER_JWT_SECRET = process.env.JWT_SECRET || "your_user_secret_key";
const ADMIN_JWT_SECRET = process.env.JWT_SECRET || "your_admin_secret_key";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return new Response(JSON.stringify({ message: "Token missing" }), {
        status: 400,
      });
    }

    // Try verifying with user secret
    try {
      const decodedUser = jwt.verify(token, USER_JWT_SECRET);
      return new Response(
        JSON.stringify({ valid: true, user: decodedUser, isAdmin: false }),
        { status: 200 }
      );
    } catch {}

    // If user verification fails, try admin secret
    try {
      const decodedAdmin = jwt.verify(token, ADMIN_JWT_SECRET);
      if (!decodedAdmin.isAdmin) {
        return new Response(
          JSON.stringify({ message: "Access forbidden: Not an admin" }),
          { status: 403 }
        );
      }
      return new Response(
        JSON.stringify({ valid: true, admin: decodedAdmin, isAdmin: true }),
        { status: 200 }
      );
    } catch {}

    // If both verifications fail
    return new Response(
      JSON.stringify({ message: "Invalid or expired token" }),
      { status: 401 }
    );
  } catch (error) {
    console.error("Token verification error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
