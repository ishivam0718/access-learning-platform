const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "183209466249-a122ef74a78tgjo0prc7hucspv7plorq.apps.googleusercontent.com";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/access_learning";
const PORT = process.env.PORT || 5000;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error", err));

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

function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({
      success: false,
      message: "Please login first"
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.json({
      success: false,
      message: "Invalid login token"
    });
  }
}

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend running successfully"
  });
});

app.post("/api/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Please fill all fields"
      });
    }

    name = name.trim();
    email = email.toLowerCase().trim();
    password = password.trim();

    if (password.length < 4) {
      return res.json({
        success: false,
        message: "Password must be at least 4 characters"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({
      success: true,
      message: "Signup successful Please login now",
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.log("Signup error:", err);
    res.json({
      success: false,
      message: "Signup failed"
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Enter email and password"
      });
    }

    email = email.toLowerCase().trim();
    password = password.trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Wrong password"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.log("Login error:", err);
    res.json({
      success: false,
      message: "Login failed"
    });
  }
});

app.post("/api/google-login", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.json({
        success: false,
        message: "Google credential missing"
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.json({
        success: false,
        message: "Google account data not found"
      });
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

    res.json({
      success: true,
      message: "Google login successfull",
      token,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.log("Google login error full:", err);

    res.json({
      success: false,
      message: err.message
    });
  }
});

app.get("/api/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (err) {
    console.log("Profile error:", err);
    res.json({
      success: false,
      message: "Profile fetch failed"
    });
  }
});

app.get("/api/progress", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      completedLessons: user.completedLessons,
      totalLessons: user.totalLessons
    });

  } catch (err) {
    console.log("Progress error:", err);
    res.json({
      success: false,
      message: "Progress fetch failed"
    });
  }
});

app.post("/api/complete-lesson", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    if (user.completedLessons < user.totalLessons) {
      user.completedLessons += 1;
      await user.save();
    }

    res.json({
      success: true,
      message: "Lesson completed",
      completedLessons: user.completedLessons,
      totalLessons: user.totalLessons
    });

  } catch (err) {
    console.log("Lesson update error:", err);
    res.json({
      success: false,
      message: "Lesson update failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});