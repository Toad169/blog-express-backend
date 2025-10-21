import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPosts(req, res) {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { id: true, username: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getPost(req, res) {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: { author: { select: { id: true, username: true } } },
    });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createPost(req, res) {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: userId } },
      },
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updatePost(req, res) {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const post = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId !== userId)
      return res.status(403).json({ message: "Not authorized" });

    const updated = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deletePost(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const post = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId !== userId)
      return res.status(403).json({ message: "Not authorized" });

    await prisma.post.delete({ where: { id: Number(id) } });
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
