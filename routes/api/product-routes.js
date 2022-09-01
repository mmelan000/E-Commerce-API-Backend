const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
// get all
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag, through: ProductTag }]
    });

    res.status(200).json(productData);
  } catch {
    res.status(500).json(err);
  }
});
// get one by id
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag }]
    });

    if (!productData) {
      res.status(404).json({ message: `No product found with ID: ${req.params.id}` });
      return;
    }

    res.status(200).json(productData);
  } catch {
    res.status(500).json(err);
  }
});
// create one
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update one by id
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});
// delete one by id
router.delete('/:id', async (req, res) => {
  try {
    const deleteProductData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteProductData) {
      res.status(404).json({ message: `No product found with ID: ${req.params.id}` });
      return;
    }

    res.status(200).json(deleteProductData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
