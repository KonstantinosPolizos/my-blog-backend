const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllPosts = asyncHandler(async (req, res) => {
  const user_id = req.user.id;

  if (!user_id) {
    res.status(400);
    throw new Error("Bad request, need token");
  }

  await prisma.post
    .findMany({
      where: {
        published: true,
        authorId: user_id,
      },
    })
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400);
      throw new Error("Posts for that user don't exist");
    })
    .finally(() => {
      prisma.$disconnect();
    });
});

const getOnePost = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    res.status(400);
    throw new Error("Bad request, need token");
  }

  const postId = req.params.id;

  if (!postId) {
    res.status(400);

    throw new Error("Bad request, need id");
  }

  await prisma.post
    .findFirst({
      where: {
        id: parseInt(postId),
        published: true,
        authorId: userId,
      },
    })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(400);
      throw new Error("Posts for that user don't exist");
    })
    .finally(() => {
      prisma.$disconnect();
    });
});

const postOnePost = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(400);

    throw new Error("Bad request, need token");
  }

  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);

    throw new Error("All fields are mendatory");
  }

  await prisma.post
    .create({
      data: {
        title: title,
        content: content,
        published: true,
        author: {
          connect: {
            email: user.email,
          },
        },
      },
    })
    .then(() => {
      res.status(200).json({ message: "ok" });
    })
    .catch((error) => {
      res.status(400);
      throw new Error("Bad request, couldn't add post");
    })
    .finally(() => {
      prisma.$disconnect();
    });
});

const updateOnePost = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    res.status(401);
    throw new Error("Not authorized user!");
  }

  const postId = req.params.id;

  if (!postId) {
    res.status(400);
    throw new Error("Unique identifier (id) is missing!");
  }

  const updateContent = req.body;

  if (!updateContent) {
    res.status(400);
    throw new Error("Updated content missing!");
  }

  await prisma.post
    .updateMany({
      where: {
        id: parseInt(postId),
        published: true,
        authorId: userId,
      },
      data: updateContent,
    })
    .then(() => {
      res.status(200).json(updateContent);
    })
    .catch((error) => {
      res.status(400);
      throw new Error("Bad request for updating post");
    })
    .finally(() => {
      prisma.$disconnect();
    });
});

const deleteOnePost = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Delete one post", tokenResult: req.user });
});

module.exports = {
  getAllPosts,
  getOnePost,
  postOnePost,
  updateOnePost,
  deleteOnePost,
};
