const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/access_learning";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) return cachedConnection;
  
  try {
    const conn = await mongoose.connect(MONGO_URI);
    cachedConnection = conn;
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  completedLessons: {
    type: Number,
    default: 0
  },
  totalLessons: {
    type: Number,
    default: 40
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function auth(req) {
  const token = req.headers.authorization;

  if (!token) {
    return {
      isValid: false,
      error: { success: false, message: "Please login first" }
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      isValid: true,
      userId: decoded.id
    };
  } catch (err) {
    return {
      isValid: false,
      error: { success: false, message: "Invalid login token" }
    };
  }
}

async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: ""
    };
  }

  try {
    await connectDB();
    
    const path = event.path.replace("/.netlify/functions/api", "");
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    // Test endpoint
    if (path === "/test" && method === "GET") {
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({
          success: true,
          message: "Backend running successfully"
        })
      };
    }

    // Signup
    if (path === "/signup" && method === "POST") {
      try {
        let { name, email, password } = body;

        if (!name || !email || !password) {
          return {
            statusCode: 400,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "Please fill all fields"
            })
          };
        }

        name = name.trim();
        email = email.toLowerCase().trim();
        password = password.trim();

        if (password.length < 4) {
          return {
            statusCode: 400,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "Password must be at least 4 characters"
            })
          };
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
          return {
            statusCode: 400,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "Email already exists"
            })
          };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
          name,
          email,
          password: hashedPassword
        });

        await user.save();

        return {
          statusCode: 200,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: true,
            message: "Signup successful Please login now",
            name: user.name,
            email: user.email
          })
        };

      } catch (err) {
        console.log("Signup error:", err);
        return {
          statusCode: 500,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: false,
            message: "Signup failed"
          })
        };
      }
    }

    // Login
    if (path === "/login" && method === "POST") {
      try {
        let { email, password } = body;

        if (!email || !password) {
          return {
            statusCode: 400,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "Enter email and password"
            })
          };
        }

        email = email.toLowerCase().trim();
        password = password.trim();

        const user = await User.findOne({ email });

        if (!user) {
          return {
            statusCode: 400,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "User not found"
            })
          };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return {
            statusCode: 400,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "Wrong password"
            })
          };
        }

        const token = jwt.sign(
          { id: user._id },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        return {
          statusCode: 200,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: true,
            message: "Login successful",
            token,
            name: user.name,
            email: user.email
          })
        };

      } catch (err) {
        console.log("Login error:", err);
        return {
          statusCode: 500,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: false,
            message: "Login failed"
          })
        };
      }
    }

    // Google Login
    if (path === "/google-login" && method === "POST") {
      try {
        const { credential } = body;

        if (!credential) {
          return {
            statusCode: 400,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "Google credential missing"
            })
          };
        }

        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
          return {
            statusCode: 400,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "Google account data not found"
            })
          };
        }

        const name = payload.name || "Google User";
        const email = payload.email.toLowerCase().trim();

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            name,
            email,
            password: "google-login-user"
          });

          await user.save();
        }

        const token = jwt.sign(
          { id: user._id },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        return {
          statusCode: 200,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: true,
            message: "Google login successfull",
            token,
            name: user.name,
            email: user.email
          })
        };

      } catch (err) {
        console.log("Google login error:", err);

        return {
          statusCode: 500,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: false,
            message: err.message
          })
        };
      }
    }

    // Get Profile
    if (path === "/profile" && method === "GET") {
      try {
        const authResult = auth(event);
        if (!authResult.isValid) {
          return {
            statusCode: 401,
            headers: corsHeaders(),
            body: JSON.stringify(authResult.error)
          };
        }

        const user = await User.findById(authResult.userId).select("-password");

        if (!user) {
          return {
            statusCode: 404,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "User not found"
            })
          };
        }

        return {
          statusCode: 200,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: true,
            user
          })
        };

      } catch (err) {
        console.log("Profile error:", err);
        return {
          statusCode: 500,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: false,
            message: "Profile fetch failed"
          })
        };
      }
    }

    // Get Progress
    if (path === "/progress" && method === "GET") {
      try {
        const authResult = auth(event);
        if (!authResult.isValid) {
          return {
            statusCode: 401,
            headers: corsHeaders(),
            body: JSON.stringify(authResult.error)
          };
        }

        const user = await User.findById(authResult.userId);

        if (!user) {
          return {
            statusCode: 404,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "User not found"
            })
          };
        }

        return {
          statusCode: 200,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: true,
            completedLessons: user.completedLessons,
            totalLessons: user.totalLessons
          })
        };

      } catch (err) {
        console.log("Progress error:", err);
        return {
          statusCode: 500,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: false,
            message: "Progress fetch failed"
          })
        };
      }
    }

    // Complete Lesson
    if (path === "/complete-lesson" && method === "POST") {
      try {
        const authResult = auth(event);
        if (!authResult.isValid) {
          return {
            statusCode: 401,
            headers: corsHeaders(),
            body: JSON.stringify(authResult.error)
          };
        }

        const user = await User.findById(authResult.userId);

        if (!user) {
          return {
            statusCode: 404,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "User not found"
            })
          };
        }

        if (user.completedLessons < user.totalLessons) {
          user.completedLessons += 1;
          await user.save();
        }

        return {
          statusCode: 200,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: true,
            message: "Lesson completed",
            completedLessons: user.completedLessons,
            totalLessons: user.totalLessons
          })
        };

      } catch (err) {
        console.log("Lesson update error:", err);
        return {
          statusCode: 500,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: false,
            message: "Lesson update failed"
          })
        };
      }
    }

    // Route not found
    return {
      statusCode: 404,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: "Route not found"
      })
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        message: "Internal server error"
      })
    };
  }
}

exports.handler = handler;
