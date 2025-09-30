import prisma from '../config/database.js';

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const existingCategory = await prisma.category.findUnique({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ error: 'Categoria já existe' });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar categoria', details: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias', details: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    if (name !== category.name) {
      const existingCategory = await prisma.category.findUnique({ where: { name } });
      if (existingCategory) {
        return res.status(400).json({ error: 'Categoria já existe' });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar categoria', details: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar categoria', details: error.message });
  }
};