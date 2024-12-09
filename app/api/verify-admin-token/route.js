import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_admin_secret_key";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ message: "No token provided" }), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ message: "Token missing" }), {
        status: 401,
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (!decoded.isAdmin) {
        return new Response(
          JSON.stringify({ message: "Access forbidden: Not an admin" }),
          { status: 403 }
        );
      }

      return new Response(
        JSON.stringify({ message: "Access granted", admin: decoded }),
        { status: 200 }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token", error }),
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error verifying admin token:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
