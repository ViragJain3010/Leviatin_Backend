import Product from '../models/product.model.js';

export const addProduct = async (req, res) => {
  try {
    const { name, quantity, price } = req.body;

    // Create new product
    const product = new Product({
      name,
      quantity,
      price,
      user: req.user.id
    });

    // Save product to database
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    console.log(products);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try{
    const user = req.user.id;

  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}