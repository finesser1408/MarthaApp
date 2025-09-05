export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: number; // require() asset id
  imageKey: string;
  rating: number;
  description?: string;
  category?: string;
};

export const ALL_PRODUCTS: Product[] = [
  // Fruits
  { id: 'fr1', name: 'Banana', price: 2.5, unit: 'kg', image: require('../assets/images/banana.jpg'), imageKey: 'banana', rating: 4.5, description: 'Fresh organic bananas rich in potassium', category: 'Fruits' },
  { id: 'fr2', name: 'Fresh Orange', price: 1.5, unit: 'kg', image: require('../assets/images/orange.jpg'), imageKey: 'orange', rating: 4.2, description: 'Sweet and juicy oranges packed with vitamin C', category: 'Fruits' },
  { id: 'fr3', name: 'Apple', price: 3.2, unit: 'kg', image: require('../assets/images/apple.jpg'), imageKey: 'apple', rating: 4.8, description: 'Crispy red apples with perfect sweetness', category: 'Fruits' },
  { id: 'fr4', name: 'Strawberry', price: 4.5, unit: 'box', image: require('../assets/images/strawberry.jpg'), imageKey: 'strawberry', rating: 4.7, description: 'Sweet organic strawberries, freshly picked', category: 'Fruits' },
  { id: 'fr5', name: 'Mango', price: 5.2, unit: 'kg', image: require('../assets/images/mango.jpg'), imageKey: 'mango', rating: 4.9, description: 'Tropical mangoes with rich flavor and aroma', category: 'Fruits' },
  { id: 'fr6', name: 'Grapes', price: 4.2, unit: 'kg', image: require('../assets/images/apple.jpg'), imageKey: 'apple', rating: 4.4, description: 'Seedless grapes, sweet and refreshing', category: 'Fruits' },
  { id: 'fr7', name: 'Fruit Mix', price: 6.5, unit: 'box', image: require('../assets/images/strawberry.jpg'), imageKey: 'strawberry', rating: 4.6, description: 'Assorted seasonal fruits', category: 'Fruits' },

  // Vegetables
  { id: 'vg1', name: 'Spinach', price: 2.2, unit: 'bunch', image: require('../assets/images/spinach.jpg'), imageKey: 'spinach', rating: 4.4, description: 'Fresh green spinach leaves', category: 'Vegetables' },
  { id: 'vg2', name: 'Potatoes', price: 1.8, unit: 'kg', image: require('../assets/images/potatoes.jpg'), imageKey: 'potatoes', rating: 4.3, description: 'Starchy and versatile potatoes', category: 'Vegetables' },
  { id: 'vg3', name: 'Leafy Greens', price: 2.0, unit: 'bunch', image: require('../assets/images/spinach.jpg'), imageKey: 'spinach', rating: 4.1, description: 'Healthy leafy green veggies', category: 'Vegetables' },
  { id: 'vg4', name: 'Baby Potatoes', price: 2.4, unit: 'kg', image: require('../assets/images/potatoes.jpg'), imageKey: 'potatoes', rating: 4.2, description: 'Small, tender potatoes', category: 'Vegetables' },
  { id: 'vg5', name: 'Green Mix', price: 3.1, unit: 'box', image: require('../assets/images/spinach.jpg'), imageKey: 'spinach', rating: 4.0, description: 'Mixed green vegetables', category: 'Vegetables' },
  { id: 'vg6', name: 'Golden Potatoes', price: 2.0, unit: 'kg', image: require('../assets/images/potatoes.jpg'), imageKey: 'potatoes', rating: 4.1, description: 'Golden skin potatoes', category: 'Vegetables' },
  { id: 'vg7', name: 'Spinach Bundle', price: 2.3, unit: 'bunch', image: require('../assets/images/spinach.jpg'), imageKey: 'spinach', rating: 4.2, description: 'Bundle of fresh spinach', category: 'Vegetables' },

  // Dairy
  { id: 'dr1', name: 'Eggs (12 pack)', price: 3.6, unit: 'tray', image: require('../assets/images/eggs.jpg'), imageKey: 'eggs', rating: 4.7, description: 'Farm fresh eggs', category: 'Dairy' },
  { id: 'dr2', name: 'Fresh Milk', price: 2.9, unit: 'liter', image: require('../assets/images/milk.jpg'), imageKey: 'milk', rating: 4.6, description: 'Creamy full-cream milk', category: 'Dairy' },
  { id: 'dr3', name: 'Skim Milk', price: 2.7, unit: 'liter', image: require('../assets/images/milk.jpg'), imageKey: 'milk', rating: 4.3, description: 'Low-fat skim milk', category: 'Dairy' },
  { id: 'dr4', name: 'Cage-free Eggs', price: 3.9, unit: 'tray', image: require('../assets/images/eggs.jpg'), imageKey: 'eggs', rating: 4.8, description: 'Cage-free large eggs', category: 'Dairy' },
  { id: 'dr5', name: 'Milk 500ml', price: 1.6, unit: '500ml', image: require('../assets/images/milk.jpg'), imageKey: 'milk', rating: 4.2, description: 'Half-liter milk', category: 'Dairy' },
  { id: 'dr6', name: 'Jumbo Eggs', price: 4.2, unit: 'tray', image: require('../assets/images/eggs.jpg'), imageKey: 'eggs', rating: 4.5, description: 'Jumbo sized eggs', category: 'Dairy' },
  { id: 'dr7', name: 'Organic Milk', price: 3.3, unit: 'liter', image: require('../assets/images/milk.jpg'), imageKey: 'milk', rating: 4.4, description: 'Organic dairy milk', category: 'Dairy' },

  // Bakery
  { id: 'bk1', name: 'White Bread', price: 1.8, unit: 'loaf', image: require('../assets/images/White Bread.jpg'), imageKey: 'bread', rating: 4.5, description: 'Soft and fresh white bread', category: 'Bakery' },
  { id: 'bk2', name: 'Sliced Bread', price: 1.9, unit: 'loaf', image: require('../assets/images/White Bread.jpg'), imageKey: 'bread', rating: 4.4, description: 'Convenient sliced loaf', category: 'Bakery' },
  { id: 'bk3', name: 'Toast Bread', price: 2.0, unit: 'loaf', image: require('../assets/images/White Bread.jpg'), imageKey: 'bread', rating: 4.3, description: 'Perfect for toast', category: 'Bakery' },
  { id: 'bk4', name: 'Family Bread', price: 2.2, unit: 'loaf', image: require('../assets/images/White Bread.jpg'), imageKey: 'bread', rating: 4.2, description: 'Large family loaf', category: 'Bakery' },
  { id: 'bk5', name: 'Sandwich Bread', price: 2.1, unit: 'loaf', image: require('../assets/images/White Bread.jpg'), imageKey: 'bread', rating: 4.1, description: 'Great for sandwiches', category: 'Bakery' },
  { id: 'bk6', name: 'Daily Bread', price: 1.7, unit: 'loaf', image: require('../assets/images/White Bread.jpg'), imageKey: 'bread', rating: 4.0, description: 'Everyday bakery loaf', category: 'Bakery' },
  { id: 'bk7', name: 'Classic Bread', price: 1.8, unit: 'loaf', image: require('../assets/images/White Bread.jpg'), imageKey: 'bread', rating: 4.2, description: 'Classic soft bread', category: 'Bakery' },

  // Meat
  { id: 'mt1', name: 'Beef Cuts', price: 8.5, unit: 'kg', image: require('../assets/images/cooking oil.jpg'), imageKey: 'cooking_oil', rating: 4.1, description: 'Premium beef cuts (placeholder image)', category: 'Meat' },
  { id: 'mt2', name: 'Chicken Breast', price: 6.2, unit: 'kg', image: require('../assets/images/eggs.jpg'), imageKey: 'eggs', rating: 4.3, description: 'Lean chicken breast (placeholder image)', category: 'Meat' },
  { id: 'mt3', name: 'Pork Chops', price: 7.4, unit: 'kg', image: require('../assets/images/milk.jpg'), imageKey: 'milk', rating: 4.0, description: 'Juicy pork chops (placeholder image)', category: 'Meat' },
  { id: 'mt4', name: 'Lamb Ribs', price: 9.9, unit: 'kg', image: require('../assets/images/almonds.jpg'), imageKey: 'almonds', rating: 4.2, description: 'Tender lamb ribs (placeholder image)', category: 'Meat' },
  { id: 'mt5', name: 'Mince Meat', price: 6.8, unit: 'kg', image: require('../assets/images/noodles.jpg'), imageKey: 'noodles', rating: 4.1, description: 'Freshly minced (placeholder image)', category: 'Meat' },
  { id: 'mt6', name: 'Chicken Wings', price: 5.9, unit: 'kg', image: require('../assets/images/doritos.jpg'), imageKey: 'doritos', rating: 4.3, description: 'Party favorite (placeholder image)', category: 'Meat' },
  { id: 'mt7', name: 'Sausages', price: 4.9, unit: 'pack', image: require('../assets/images/tomato sauce.jpg'), imageKey: 'tomato_sauce', rating: 4.0, description: 'Breakfast sausages (placeholder image)', category: 'Meat' },

  // Beverages
  { id: 'bv1', name: 'Milo', price: 3.2, unit: 'tin', image: require('../assets/images/milo.jpg'), imageKey: 'milo', rating: 4.6, description: 'Chocolate malt drink', category: 'Beverages' },
  { id: 'bv2', name: 'Fresh Milk', price: 2.9, unit: 'liter', image: require('../assets/images/milk.jpg'), imageKey: 'milk', rating: 4.5, description: 'Creamy fresh milk', category: 'Beverages' },
  { id: 'bv3', name: 'Cocoa Drink', price: 3.0, unit: 'tin', image: require('../assets/images/milo.jpg'), imageKey: 'milo', rating: 4.4, description: 'Delicious cocoa beverage', category: 'Beverages' },
  { id: 'bv4', name: 'Dairy Drink', price: 2.5, unit: '500ml', image: require('../assets/images/milk.jpg'), imageKey: 'milk', rating: 4.3, description: 'Refreshing dairy drink', category: 'Beverages' },
  { id: 'bv5', name: 'Chocolate Mix', price: 3.4, unit: 'tin', image: require('../assets/images/milo.jpg'), imageKey: 'milo', rating: 4.2, description: 'Chocolate drink mix', category: 'Beverages' },
  { id: 'bv6', name: 'Milk 250ml', price: 1.2, unit: '250ml', image: require('../assets/images/milk.jpg'), imageKey: 'milk', rating: 4.1, description: 'Small pack milk', category: 'Beverages' },
  { id: 'bv7', name: 'Malt Drink', price: 3.1, unit: 'tin', image: require('../assets/images/milo.jpg'), imageKey: 'milo', rating: 4.2, description: 'Malt-based beverage', category: 'Beverages' },

  // Snacks
  { id: 'sn1', name: 'Doritos', price: 2.1, unit: 'pack', image: require('../assets/images/doritos.jpg'), imageKey: 'doritos', rating: 4.5, description: 'Corn chips snack', category: 'Snacks' },
  { id: 'sn2', name: 'Instant Noodles', price: 1.2, unit: 'pack', image: require('../assets/images/noodles.jpg'), imageKey: 'noodles', rating: 4.3, description: 'Quick instant noodles', category: 'Snacks' },
  { id: 'sn3', name: 'Almonds', price: 4.9, unit: 'pack', image: require('../assets/images/almonds.jpg'), imageKey: 'almonds', rating: 4.7, description: 'Roasted almonds', category: 'Snacks' },
  { id: 'sn4', name: 'Snack Noodles', price: 1.1, unit: 'pack', image: require('../assets/images/noodles.jpg'), imageKey: 'noodles', rating: 4.1, description: 'Crunchy noodles snack', category: 'Snacks' },
  { id: 'sn5', name: 'Nut Mix', price: 5.2, unit: 'pack', image: require('../assets/images/almonds.jpg'), imageKey: 'almonds', rating: 4.6, description: 'Assorted nuts', category: 'Snacks' },
  { id: 'sn6', name: 'Cheese Chips', price: 2.2, unit: 'pack', image: require('../assets/images/doritos.jpg'), imageKey: 'doritos', rating: 4.2, description: 'Cheesy corn chips', category: 'Snacks' },
  { id: 'sn7', name: 'Tomato Crisps', price: 2.0, unit: 'pack', image: require('../assets/images/tomato sauce.jpg'), imageKey: 'tomato_sauce', rating: 4.0, description: 'Tomato flavored crisps', category: 'Snacks' },
];
