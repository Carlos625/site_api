export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Nome � obrigat�rio' });
  }

  if (!email || email.trim().length === 0) {
    return res.status(400).json({ error: 'Email � obrigat�rio' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Email inv�lido' });
  }

  if (req.method === 'POST') {
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no m�nimo 6 caracteres' });
    }
  }

  next();
};

export const validateCategory = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Nome da categoria � obrigat�rio' });
  }

  if (name.length < 3) {
    return res.status(400).json({ error: 'Nome da categoria deve ter no m�nimo 3 caracteres' });
  }

  next();
};

export const validatePost = (req, res, next) => {
  const { title, content, userId, categoryId } = req.body;

  if (req.method === 'POST') {
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'T�tulo � obrigat�rio' });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Conte�do � obrigat�rio' });
    }

    if (!userId || userId.trim().length === 0) {
      return res.status(400).json({ error: 'ID do usu�rio � obrigat�rio' });
    }

    if (!categoryId || categoryId.trim().length === 0) {
      return res.status(400).json({ error: 'ID da categoria � obrigat�rio' });
    }
  }

  if (req.method === 'PUT') {
    if (title !== undefined && title.trim().length === 0) {
      return res.status(400).json({ error: 'T�tulo n�o pode ser vazio' });
    }

    if (content !== undefined && content.trim().length === 0) {
      return res.status(400).json({ error: 'Conte�do n�o pode ser vazio' });
    }
  }

  if (title && title.length < 5) {
    return res.status(400).json({ error: 'T�tulo deve ter no m�nimo 5 caracteres' });
  }

  if (content && content.length < 10) {
    return res.status(400).json({ error: 'Conte�do deve ter no m�nimo 10 caracteres' });
  }

  next();
};