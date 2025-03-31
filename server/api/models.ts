import express from 'express';
import { storage } from '../storage';

const router = express.Router();

// Tüm modelleri getir
router.get('/', async (req, res) => {
  try {
    const models = await storage.getAllModels();
    res.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Modeller alınırken bir hata oluştu' });
  }
});

// ID'ye göre model getir
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Geçersiz model ID' });
    }
    
    const model = await storage.getModel(id);
    if (!model) {
      return res.status(404).json({ error: 'Model bulunamadı' });
    }
    
    // Model kullanım sayısını arttır
    await storage.updateModelUsageCount(id);
    
    res.json(model);
  } catch (error) {
    console.error('Error fetching model:', error);
    res.status(500).json({ error: 'Model alınırken bir hata oluştu' });
  }
});

// Kategoriye göre modelleri getir
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const models = await storage.getModelsByCategory(category);
    res.json(models);
  } catch (error) {
    console.error('Error fetching models by category:', error);
    res.status(500).json({ error: 'Modeller alınırken bir hata oluştu' });
  }
});

export default router;