const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
// get all
router.get('/', async (req, res) => {
  try{
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }]
    });

    res.status(200).json(tagData);
  } catch {
    res.status(500).json(err);
  }
});
// get one by id
router.get('/:id', async (req, res) => {
  try{
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }]
    });

    if (!tagData) {
      res.status(404).json({ message: `No tag found with ID: ${req.params.id}` });
      return;
    }

    res.status(200).json(tagData);
  } catch {
    res.status(500).json(err);
  }
});
// add one
router.post('/', async (req, res) => {
  try {
    const newTagData = await Tag.create({
      tag_name: req.body.tag_name,
    });

    res.status(200).json(newTagData);
  } catch (err) {
    res.status(400).json(err);
  }
});
// update on by id
router.put('/:id', async (req, res) => {
  try{
    const tagData = await Tag.findByPk(req.params.id);
    const updateTagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: `No tag found with ID: ${req.params.id}` });
      return;
    }
  
    if (!updateTagData[0]) {
      res.status(400).json({ message: `No tag data updated for ID: ${req.params.id}` });
      return;
    };

    res.status(200).json(updateTagData);
  } catch {
    res.status(500).json(err);
  };

});
// delete one by id
router.delete('/:id', async (req, res) => {
  try {
    const deleteTagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteTagData) {
      res.status(404).json({ message: `No tag found with ID: ${req.params.id}` });
      return;
    }

    res.status(200).json(deleteTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
