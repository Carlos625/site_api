import bcrypt from 'bcrypt';
import prisma from '../config/database.js';

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos s�o obrigat�rios' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email j� cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usu�rio', details: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usu�rios', details: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        posts: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usu�rio n�o encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usu�rio', details: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'Usu�rio n�o encontrado' });
    }

    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email j� cadastrado' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usu�rio', details: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'Usu�rio n�o encontrado' });
    }

    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usu�rio', details: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'Usu�rio n�o encontrado' });
    }

    const posts = await prisma.post.findMany({
      where: { userId: id },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      totalPosts: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar postagens do usu�rio', details: error.message });
  }
};