const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

<<<<<<< HEAD
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!JWT_SECRET || !GOOGLE_CLIENT_ID) {
  console.error("Missing required environment variables: JWT_SECRET or GOOGLE_CLIENT_ID");
}
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/access_learning";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
=======
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const MONGO_URI = process.env.MONGO_URI;

if (!GOOGLE_CLIENT_ID) {
  console.warn("GOOGLE_CLIENT_ID is not configured. Google login will fail.");
}

if (!MONGO_URI) {
  console.warn("MONGO_URI is not configured. Database access will fail.");
}

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID || "");
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) return cachedConnection;

<<<<<<< HEAD
  try {
    const conn = await mongoose.connect(MONGO_URI);
=======
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }
  
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      maxPoolSize: 5
    });
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
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
<<<<<<< HEAD
    unique: true,
    sparse: true
=======
    unique: true
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
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

<<<<<<< HEAD
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

=======
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
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
<<<<<<< HEAD

  // Handle CORS preflight
=======
  
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: ""
    };
  }

  try {
    await connectDB();
<<<<<<< HEAD

    let path = event.path || "";
    path = path.replace("/.netlify/functions/api", "").replace(/^\/api/, "");
    if (!path.startsWith("/")) path = "/" + path;

    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    // Test endpoint
=======
    
    const path = event.path.replace("/.netlify/functions/api", "");
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
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

<<<<<<< HEAD
    // Signup
=======
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
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

<<<<<<< HEAD
        if (!isValidEmail(email)) {
          return {
            statusCode: 400,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "Invalid email format"
            })
          };
        }

=======
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
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

<<<<<<< HEAD
        if (name.length > 100) {
          return {
            statusCode: 400,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "Name too long"
            })
          };
        }

=======
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
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
<<<<<<< HEAD
        console.log("Signup error:", err.message);
=======
        console.log("Signup error:", err);
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
        return {
          statusCode: 500,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: false,
<<<<<<< HEAD
            message: err.code === 11000 ? "Email already exists" : "Signup failed"
=======
            message: "Signup failed"
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
          })
        };
      }
    }

<<<<<<< HEAD
    // Login
=======
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
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

<<<<<<< HEAD
        if (!isValidEmail(email)) {
          return {
            statusCode: 400,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "Invalid email format"
            })
          };
        }

=======
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
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
<<<<<<< HEAD
        console.log("Login error:", err.message);
=======
        console.log("Login error:", err);
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
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

<<<<<<< HEAD
    // Google Login
=======
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
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

<<<<<<< HEAD
        if (!GOOGLE_CLIENT_ID) {
          return {
            statusCode: 500,
            headers: corsHeaders(),
            body: JSON.stringify({
              success: false,
              message: "Server error"
            })
          };
        }

=======
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
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
<<<<<<< HEAD
        console.log("Google login error:", err.message || "Unknown error");
=======
        console.log("Google login error:", err);
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf

        return {
          statusCode: 500,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: false,
<<<<<<< HEAD
            message: "Google login failed"
=======
            message: err.message
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
          })
        };
      }
    }

<<<<<<< HEAD
    // Get Profile
=======
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
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

<<<<<<< HEAD
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

=======
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
        return {
          statusCode: 200,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: true,
            user
          })
        };
<<<<<<< HEAD

=======
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
      } catch (err) {
        console.log("Profile error:", err);
        return {
          statusCode: 500,
          headers: corsHeaders(),
          body: JSON.stringify({
            success: false,
<<<<<<< HEAD
            message: "Profile fetch failed"
=======
            message: "Failed to fetch profile"
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
          })
        };
      }
    }

<<<<<<< HEAD
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
=======
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
    return {
      statusCode: 404,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
<<<<<<< HEAD
        message: "Route not found"
      })
    };

  } catch (err) {
    console.error("Function error:", err);
=======
        message: "Endpoint not found"
      })
    };
  } catch (err) {
    console.error("Handler error:", err);
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
<<<<<<< HEAD
        message: "Internal server error"
=======
        message: "Server error"
>>>>>>> aacb54ff25667172363395fb5289e633b286cdaf
      })
    };
  }
}

exports.handler = handler;
