const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const signupUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mendatory");
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const postOneUser = await prisma.user.create({
    data: {
      name: username,
      email: email,
      password: hashedPass,
    },
  });

  if (!postOneUser) {
    res.status(400);
    throw new Error("Couldn't create new user!");
  }

  res.status(200).json(postOneUser);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);

    throw new Error("All fields are mendatory");
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("No such user. Please sign up.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Wrong password.");
    }

    const token = await jwt.sign(
      {
        user: {
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60min" }
    );

    const expiresIn = 60 * 60; // 60 minutes in seconds

    res.status(200).json({
      token,
      type: "Bearer",
      expiresIn,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = { signupUser, loginUser };
