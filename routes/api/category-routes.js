const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try{
    const categoryData = await Category.findAll({
      include: [{ model: Product}]
    });

    res.status(200).json(categoryData);
  } catch {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try{
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product}]
    });

    if (!categoryData) {
      res.status(404).json({ message: `No category found with ID: ${req.params.id}` });
      return;
    }

    res.status(200).json(categoryData);
  } catch {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategoryData = await Category.create({
      category_name: req.body.category_name,
    });

    res.status(200).json(newCategoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryData) {
      res.status(404).json({ message: `No category found with ID: ${req.params.id}` });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
