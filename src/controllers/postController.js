import prisma from '../config/database.js';

export const createPost = async (req, res) => {
  try {
    const { title, content, userId, categoryId } = req.body;

    if (!title || !content || !userId || !categoryId) {
      return res.status(400).json({ error: 'Todos os campos s�o obrigat�rios' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'Usu�rio n�o encontrado' });
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(404).json({ error: 'Categoria n�o encontrada' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId,
        categoryId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar postagem', details: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        error: 'Par�metros inv�lidos. Page deve ser >= 1 e limit entre 1 e 100'
      });
    }

    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.post.count(),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      data: posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        postsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar postagens', details: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Postagem n�o encontrada' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar postagem', details: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryId } = req.body;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: 'Postagem n�o encontrada' });
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        return res.status(404).json({ error: 'Categoria n�o encontrada' });
      }
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (categoryId) updateData.categoryId = categoryId;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar postagem', details: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: 'Postagem n�o encontrada' });
    }

    await prisma.post.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar postagem', details: error.message });
  }
};