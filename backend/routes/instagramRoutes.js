import express from "express";

const instagramRouter = express.Router();

instagramRouter.get("/posts", async (req, res) => {
  try {
    const widgetUrl = process.env.SNAPWIDGET_LINK;
    
    if (!widgetUrl) {
      console.error("SNAPWIDGET_LINK não está definido no arquivo .env");
      return res.status(500).json({ error: "Configuração do SnapWidget ausente." });
    }

    // Substituição do AXIOS pelo FETCH nativo
    const response = await fetch(widgetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const html = await response.text();
    const posts = [];

    // Substituição do CHEERIO por REGEX
    // Procura por todas as tags <img>
    const imgTags = html.match(/<img\s+[^>]*>/gi) || [];

    imgTags.forEach((tag) => {
      // Função auxiliar para extrair atributos
      const getAttr = (name) => {
        const match = tag.match(new RegExp(`${name}="([^"]+)"`, 'i'));
        return match ? match[1] : null;
      };

      const link = getAttr("data-link");
      // Tenta pegar a imagem média, se não tiver, tenta a pequena ou grande
      const img = getAttr("data-src-medium") || getAttr("data-src-small") || getAttr("data-src-large");

      if (link && img) {
        posts.push({ link, img });
      }
    });

    res.json(posts);
  } catch (error) {
    console.error("Erro ao buscar os posts:", error.message);
    res.status(500).json({ error: "Falha ao obter dados do SnapWidget." });
  }
});

export { instagramRouter };