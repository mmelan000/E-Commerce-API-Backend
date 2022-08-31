const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try{
    const tagData = await Tag.findAll({
      include: [{ model: Product }]
    });

    res.status(200).json(tagData);
  } catch {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }]
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

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTagData = await Tag.create({
      tag_name: req.body.tag_name,
    });

    res.status(200).json(newTagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
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

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
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
