export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  if (!email || email.trim().length === 0) {
    return res.status(400).json({ error: 'Email é obrigatório' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (req.method === 'POST') {
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }
  }

  next();
};

export const validateCategory = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
  }

  if (name.length < 3) {
    return res.status(400).json({ error: 'Nome da categoria deve ter no mínimo 3 caracteres' });
  }

  next();
};

export const validatePost = (req, res, next) => {
  const { title, content, userId, categoryId } = req.body;

  if (req.method === 'POST') {
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Conteúdo é obrigatório' });
    }

    if (!userId || userId.trim().length === 0) {
      return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }

    if (!categoryId || categoryId.trim().length === 0) {
      return res.status(400).json({ error: 'ID da categoria é obrigatório' });
    }
  }

  if (req.method === 'PUT') {
    if (title !== undefined && title.trim().length === 0) {
      return res.status(400).json({ error: 'Título não pode ser vazio' });
    }

    if (content !== undefined && content.trim().length === 0) {
      return res.status(400).json({ error: 'Conteúdo não pode ser vazio' });
    }
  }

  if (title && title.length < 5) {
    return res.status(400).json({ error: 'Título deve ter no mínimo 5 caracteres' });
  }

  if (content && content.length < 10) {
    return res.status(400).json({ error: 'Conteúdo deve ter no mínimo 10 caracteres' });
  }

  next();
};