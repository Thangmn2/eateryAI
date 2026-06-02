export const UCI_DEMO_CENTER = {
  latitude: 33.6461,
  longitude: -117.8425,
}

export const localDemoMenuDocuments = [
  {
    _id: {
      restaurant_name: 'Panda Express @ West Food Court',
      address: '232-A Student Center, Irvine, CA 92697',
      coords: [-117.8427, 33.6491],
    },
    restaurant: 'Panda Express @ West Food Court',
    restaurant_url: 'https://uci.mydininghub.com/en/location/panda-express-at-west-food-court',
    address: '232-A Student Center, Irvine, CA 92697',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Chinese, Fast Casual, Campus Dining',
    attribute_tags: 'FlexDine, Mobile Ordering, UCI Demo',
    latitude_coordinates: 33.6491,
    longitude_coordinates: -117.8427,
    menu_items: [
      {
        name: 'Entrees',
        desc: 'Representative campus demo menu. Verify exact offerings before production use.',
        items: [
          { name: 'Orange Chicken Bowl', description: 'Crispy chicken in a sweet orange sauce with rice or chow mein.', price: 10.5 },
          { name: 'Broccoli Beef Bowl', description: 'Tender beef with broccoli in a savory ginger soy sauce.', price: 10.5 },
          { name: 'Kung Pao Chicken Plate', description: 'Chicken, peanuts, peppers, and vegetables with two sides.', price: 12.25 },
          { name: 'Honey Walnut Shrimp Plate', description: 'Shrimp in honey sauce with glazed walnuts and two sides.', price: 13.75 },
        ],
      },
      {
        name: 'Sides',
        items: [
          { name: 'Chow Mein', description: 'Stir-fried noodles with cabbage, celery, and onions.', price: 5.25 },
          { name: 'Fried Rice', description: 'Rice tossed with egg, peas, carrots, and green onions.', price: 5.25 },
        ],
      },
    ],
  },
  {
    _id: {
      restaurant_name: 'Subway @ West Food Court',
      address: 'Student Center, Irvine, CA 92697',
      coords: [-117.8425, 33.649],
    },
    restaurant: 'Subway @ West Food Court',
    restaurant_url: 'https://uci.mydininghub.com/en/location/subway-at-west-food-court',
    address: 'Student Center, Irvine, CA 92697',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Sandwiches, Fast Casual, Campus Dining',
    attribute_tags: 'FlexDine, Mobile Ordering, UCI Demo',
    latitude_coordinates: 33.649,
    longitude_coordinates: -117.8425,
    menu_items: [
      {
        name: 'Sandwiches',
        items: [
          { name: 'Turkey Breast 6-inch', description: 'Turkey breast sandwich with choice of vegetables and sauce.', price: 8.49 },
          { name: 'Italian B.M.T. 6-inch', description: 'Genoa salami, pepperoni, and ham with cheese and toppings.', price: 8.99 },
          { name: 'Veggie Delite 6-inch', description: 'Fresh vegetables with cheese and sauce on bread.', price: 7.49 },
          { name: 'Tuna 6-inch', description: 'Tuna salad sandwich with choice of vegetables.', price: 8.49 },
        ],
      },
      {
        name: 'Bowls & Sides',
        items: [
          { name: 'Rotisserie Chicken Protein Bowl', description: 'Chicken, vegetables, cheese, and sauce without bread.', price: 11.99 },
          { name: 'Chocolate Chip Cookie', description: 'Fresh-baked cookie.', price: 1.39 },
        ],
      },
    ],
  },
  {
    _id: {
      restaurant_name: 'Starbucks @ Biological Sciences',
      address: 'Biological Sciences, Irvine, CA 92697',
      coords: [-117.8447, 33.6456],
    },
    restaurant: 'Starbucks @ Biological Sciences',
    restaurant_url: 'https://uci.mydininghub.com/en/location/starbucks-at-biological-sciences',
    address: 'Biological Sciences, Irvine, CA 92697',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Coffee, Cafe, Campus Dining',
    attribute_tags: 'Zotbucks, Mobile Ordering, UCI Demo',
    latitude_coordinates: 33.6456,
    longitude_coordinates: -117.8447,
    menu_items: [
      {
        name: 'Coffee & Espresso',
        items: [
          { name: 'Caffe Latte', description: 'Espresso with steamed milk.', price: 5.25 },
          { name: 'Iced Brown Sugar Oatmilk Shaken Espresso', description: 'Espresso shaken with brown sugar syrup and oatmilk.', price: 6.45 },
          { name: 'Cold Brew', description: 'Slow-steeped cold coffee served over ice.', price: 4.95 },
        ],
      },
      {
        name: 'Food',
        items: [
          { name: 'Spinach Feta Egg White Wrap', description: 'Egg whites, spinach, feta, and tomato in a wheat wrap.', price: 5.95 },
          { name: 'Turkey Bacon Cheddar Sandwich', description: 'Turkey bacon, egg whites, and cheddar on an English muffin.', price: 5.95 },
          { name: 'Butter Croissant', description: 'Flaky baked croissant.', price: 3.75 },
        ],
      },
    ],
  },
  {
    _id: {
      restaurant_name: 'Jamba @ East Food Court',
      address: 'East Food Court, Irvine, CA 92697',
      coords: [-117.841, 33.6449],
    },
    restaurant: 'Jamba @ East Food Court',
    restaurant_url: 'https://uci.mydininghub.com/en/sitemap',
    address: 'East Food Court, Irvine, CA 92697',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Smoothies, Juice, Campus Dining',
    attribute_tags: 'FlexDine, Starship, UCI Demo',
    latitude_coordinates: 33.6449,
    longitude_coordinates: -117.841,
    menu_items: [
      {
        name: 'Smoothies',
        items: [
          { name: 'Mango-a-Go-Go', description: 'Mango and passion fruit smoothie.', price: 7.25 },
          { name: 'Strawberries Wild', description: 'Strawberry and banana smoothie.', price: 7.25 },
          { name: 'Razzmatazz', description: 'Berry smoothie with orange sherbet.', price: 7.25 },
          { name: 'Acai Super-Antioxidant', description: 'Acai and berry smoothie.', price: 7.95 },
        ],
      },
      {
        name: 'Bowls',
        items: [
          { name: 'Acai Primo Bowl', description: 'Acai blend with fruit, granola, and honey.', price: 9.95 },
          { name: 'Vanilla Blue Sky Bowl', description: 'Vanilla coconut milk blend with fruit and granola.', price: 9.95 },
        ],
      },
    ],
  },
  {
    _id: {
      restaurant_name: 'Bento Sushi @ UCI',
      address: 'UC Irvine, Irvine, CA 92697',
      coords: [-117.8422, 33.6486],
    },
    restaurant: 'Bento Sushi @ UCI',
    restaurant_url: 'https://uci.mydininghub.com/en/locations/mobile-ordering',
    address: 'UC Irvine, Irvine, CA 92697',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Sushi, Japanese, Campus Dining',
    attribute_tags: 'Starship, Mobile Ordering, UCI Demo',
    latitude_coordinates: 33.6486,
    longitude_coordinates: -117.8422,
    menu_items: [
      {
        name: 'Sushi',
        items: [
          { name: 'California Roll', description: 'Crab-style roll with avocado and cucumber.', price: 8.99 },
          { name: 'Spicy Tuna Roll', description: 'Tuna roll with spicy sauce.', price: 10.99 },
          { name: 'Salmon Avocado Roll', description: 'Salmon and avocado sushi roll.', price: 10.99 },
          { name: 'Vegetable Roll', description: 'Vegetable sushi roll with avocado and cucumber.', price: 8.49 },
        ],
      },
      {
        name: 'Bowls',
        items: [
          { name: 'Chicken Teriyaki Bowl', description: 'Chicken teriyaki with rice and vegetables.', price: 11.99 },
          { name: 'Poke Bowl', description: 'Rice bowl with fish, vegetables, and sauce.', price: 13.99 },
        ],
      },
    ],
  },
  {
    _id: {
      restaurant_name: 'Anthill Pub & Grille',
      address: 'Student Center, Irvine, CA 92697',
      coords: [-117.8429, 33.6493],
    },
    restaurant: 'Anthill Pub & Grille',
    restaurant_url: 'https://uci.mydininghub.com/en/locations/mobile-ordering',
    address: 'Student Center, Irvine, CA 92697',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Pub, Burgers, Campus Dining',
    attribute_tags: 'FlexDine, Mobile Ordering, UCI Demo',
    latitude_coordinates: 33.6493,
    longitude_coordinates: -117.8429,
    menu_items: [
      {
        name: 'Pub Plates',
        items: [
          { name: 'Anteater Burger', description: 'Burger with lettuce, tomato, onion, and sauce.', price: 12.5 },
          { name: 'Chicken Tenders', description: 'Crispy chicken tenders with dipping sauce.', price: 10.95 },
          { name: 'Loaded Fries', description: 'Fries topped with cheese, sauce, and scallions.', price: 8.95 },
          { name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, and Caesar dressing.', price: 9.95 },
        ],
      },
    ],
  },
  {
    _id: {
      restaurant_name: 'Einstein Bros Bagels @ UCI',
      address: 'UC Irvine, Irvine, CA 92697',
      coords: [-117.8435, 33.6468],
    },
    restaurant: 'Einstein Bros Bagels @ UCI',
    restaurant_url: 'https://uci.mydininghub.com/en/locations/mobile-ordering',
    address: 'UC Irvine, Irvine, CA 92697',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Bagels, Breakfast, Cafe',
    attribute_tags: 'FlexDine, Mobile Ordering, UCI Demo',
    latitude_coordinates: 33.6468,
    longitude_coordinates: -117.8435,
    menu_items: [
      {
        name: 'Bagels & Breakfast',
        items: [
          { name: 'Bacon Egg and Cheese Bagel', description: 'Bacon, egg, and cheese on a bagel.', price: 7.95 },
          { name: 'Nova Lox Bagel', description: 'Smoked salmon, cream cheese, capers, onion, and tomato.', price: 10.95 },
          { name: 'Avocado Toast Bagel', description: 'Toasted bagel with avocado and seasoning.', price: 7.5 },
          { name: 'Hash Brown Side', description: 'Crispy hash brown side.', price: 2.95 },
        ],
      },
    ],
  },
  {
    _id: {
      restaurant_name: 'Zot N Go Market',
      address: 'Student Center, Irvine, CA 92697',
      coords: [-117.8428, 33.6488],
    },
    restaurant: 'Zot N Go Market',
    restaurant_url: 'https://uci.mydininghub.com/en/meal-plans/orientation',
    address: 'Student Center, Irvine, CA 92697',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Market, Grab and Go, Campus Dining',
    attribute_tags: 'FlexDine, Zotbucks, UCI Demo',
    latitude_coordinates: 33.6488,
    longitude_coordinates: -117.8428,
    menu_items: [
      {
        name: 'Grab and Go',
        items: [
          { name: 'Turkey Sandwich', description: 'Turkey sandwich with cheese, lettuce, and tomato.', price: 8.95 },
          { name: 'Chicken Caesar Wrap', description: 'Chicken Caesar salad in a wrap.', price: 8.95 },
          { name: 'Greek Yogurt Parfait', description: 'Greek yogurt with fruit and granola.', price: 5.95 },
          { name: 'Hummus Snack Box', description: 'Hummus with pita and vegetables.', price: 6.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Mendocino Farms @ UTC', address: '4187 Campus Dr, Irvine, CA 92612', coords: [-117.8395, 33.6492] },
    restaurant: 'Mendocino Farms @ UTC',
    restaurant_url: 'https://www.mendocinofarms.com/menu/',
    address: '4187 Campus Dr, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Sandwiches, Salads, Cafe',
    attribute_tags: 'UTC, University Center, UCI Demo',
    latitude_coordinates: 33.6492,
    longitude_coordinates: -117.8395,
    menu_items: [
      {
        name: 'Sandwiches & Salads',
        items: [
          { name: 'Not So Fried Chicken Sandwich', description: 'Shaved chicken, krispies, mustard pickle slaw, tomato, and herb aioli.', price: 13.95 },
          { name: 'Avocado Quinoa Superfood Ensalada', description: 'Quinoa, avocado, greens, citrus, and vinaigrette.', price: 14.75 },
          { name: 'Turkey Avo Salsa Verde', description: 'Turkey, avocado, salsa verde, greens, and cheese on bread.', price: 13.95 },
          { name: 'Thai Mango Salad', description: 'Greens, mango, vegetables, herbs, and Thai-style dressing.', price: 14.5 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Luna Grill @ UTC', address: '4143 Campus Dr, Irvine, CA 92612', coords: [-117.8386, 33.6491] },
    restaurant: 'Luna Grill @ UTC',
    restaurant_url: 'https://www.lunagrill.com/menu/',
    address: '4143 Campus Dr, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Mediterranean, Bowls, Grill',
    attribute_tags: 'UTC, University Center, UCI Demo',
    latitude_coordinates: 33.6491,
    longitude_coordinates: -117.8386,
    menu_items: [
      {
        name: 'Mediterranean Plates',
        items: [
          { name: 'Chicken Kabob Plate', description: 'Grilled chicken kabob with rice, salad, pita, and sauce.', price: 15.99 },
          { name: 'Gyro Meat Plate', description: 'Gyro meat with rice, salad, pita, and tzatziki.', price: 15.49 },
          { name: 'Falafel Plate', description: 'Falafel with rice, salad, pita, and sauce.', price: 13.99 },
          { name: 'Santorini Bowl', description: 'Mediterranean bowl with protein, greens, rice, and toppings.', price: 14.99 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'In-N-Out Burger @ UTC', address: '4115 Campus Dr, Irvine, CA 92612', coords: [-117.838, 33.6487] },
    restaurant: 'In-N-Out Burger @ UTC',
    restaurant_url: 'https://www.in-n-out.com/menu',
    address: '4115 Campus Dr, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Burgers, Fast Food',
    attribute_tags: 'UTC, University Center, UCI Demo',
    latitude_coordinates: 33.6487,
    longitude_coordinates: -117.838,
    menu_items: [
      {
        name: 'Burgers & Fries',
        items: [
          { name: 'Double-Double', description: 'Two beef patties, two cheese slices, lettuce, tomato, spread, and onion.', price: 5.95 },
          { name: 'Cheeseburger', description: 'Beef patty with cheese, lettuce, tomato, spread, and onion.', price: 4.25 },
          { name: 'Hamburger', description: 'Beef patty with lettuce, tomato, spread, and onion.', price: 3.75 },
          { name: 'French Fries', description: 'Fresh-cut fries.', price: 2.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Blaze Pizza @ UTC', address: '4255 Campus Dr, Irvine, CA 92612', coords: [-117.8404, 33.6499] },
    restaurant: 'Blaze Pizza @ UTC',
    restaurant_url: 'https://www.blazepizza.com/menu/',
    address: '4255 Campus Dr, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Pizza, Fast Casual',
    attribute_tags: 'UTC, University Center, UCI Demo',
    latitude_coordinates: 33.6499,
    longitude_coordinates: -117.8404,
    menu_items: [
      {
        name: 'Pizza',
        items: [
          { name: 'Build Your Own Pizza', description: 'Custom pizza with choice of sauce, cheese, toppings, and finishers.', price: 11.95 },
          { name: 'BBQ Chicken Pizza', description: 'Chicken, mozzarella, red onion, banana peppers, and BBQ sauce.', price: 12.95 },
          { name: 'Meat Eater Pizza', description: 'Pepperoni, meatballs, red onion, mozzarella, and red sauce.', price: 12.95 },
          { name: 'Simple Pie', description: 'Mozzarella, parmesan, and red sauce.', price: 8.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'California Gogi @ UTC', address: '4237 Campus Dr, Irvine, CA 92612', coords: [-117.84, 33.6496] },
    restaurant: 'California Gogi @ UTC',
    restaurant_url: 'https://www.californiagogi.com/',
    address: '4237 Campus Dr, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Korean, Bowls, Fast Casual',
    attribute_tags: 'UTC, University Center, UCI Demo',
    latitude_coordinates: 33.6496,
    longitude_coordinates: -117.84,
    menu_items: [
      {
        name: 'Korean Bowls',
        items: [
          { name: 'Bulgogi Beef Bowl', description: 'Marinated beef with rice, vegetables, and sauce.', price: 12.95 },
          { name: 'Spicy Pork Bowl', description: 'Spicy pork with rice, vegetables, and sauce.', price: 11.95 },
          { name: 'Chicken Gogi Bowl', description: 'Grilled chicken with rice, vegetables, and sauce.', price: 11.95 },
          { name: 'Kimchi Fried Rice', description: 'Fried rice with kimchi, egg, and vegetables.', price: 10.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Northern Cafe @ UTC', address: '4175 Campus Dr, Irvine, CA 92612', coords: [-117.8392, 33.649] },
    restaurant: 'Northern Cafe @ UTC',
    restaurant_url: 'https://www.northerncafeirvine.com/',
    address: '4175 Campus Dr, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Chinese, Noodles, Dumplings',
    attribute_tags: 'UTC, University Center, UCI Demo',
    latitude_coordinates: 33.649,
    longitude_coordinates: -117.8392,
    menu_items: [
      {
        name: 'Noodles & Dumplings',
        items: [
          { name: 'Beef Noodle Soup', description: 'Noodle soup with braised beef and vegetables.', price: 13.95 },
          { name: 'Pork Soup Dumplings', description: 'Steamed dumplings with pork filling and soup.', price: 11.95 },
          { name: 'Dan Dan Noodles', description: 'Noodles with spicy sesame sauce and minced pork.', price: 12.95 },
          { name: 'Scallion Pancake', description: 'Crispy savory pancake with scallions.', price: 6.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'MAD Dumplings @ UTC', address: 'University Center, Irvine, CA 92612', coords: [-117.8398, 33.6498] },
    restaurant: 'MAD Dumplings @ UTC',
    restaurant_url: 'https://www.maddumplings.com/',
    address: 'University Center, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Dumplings, Asian Fusion',
    attribute_tags: 'UTC, University Center, UCI Demo',
    latitude_coordinates: 33.6498,
    longitude_coordinates: -117.8398,
    menu_items: [
      {
        name: 'Dumplings & Bowls',
        items: [
          { name: 'Pork Dumplings', description: 'Pan-fried dumplings with pork filling.', price: 10.95 },
          { name: 'Chicken Dumplings', description: 'Pan-fried dumplings with chicken filling.', price: 10.95 },
          { name: 'Dumpling Bowl', description: 'Dumplings served over rice with vegetables and sauce.', price: 12.95 },
          { name: 'Garlic Noodles', description: 'Noodles tossed with garlic sauce and scallions.', price: 9.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Cha For Tea @ UTC', address: '4187 Campus Dr, Irvine, CA 92612', coords: [-117.8396, 33.6494] },
    restaurant: 'Cha For Tea @ UTC',
    restaurant_url: 'https://chafortea.com/',
    address: '4187 Campus Dr, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Boba, Tea, Taiwanese',
    attribute_tags: 'UTC, University Center, UCI Demo',
    latitude_coordinates: 33.6494,
    longitude_coordinates: -117.8396,
    menu_items: [
      {
        name: 'Tea & Snacks',
        items: [
          { name: 'Almond Milk Tea', description: 'Milk tea with almond flavor.', price: 5.95 },
          { name: 'Thai Tea', description: 'Sweet Thai tea with milk.', price: 5.95 },
          { name: 'Popcorn Chicken', description: 'Crispy Taiwanese-style chicken bites.', price: 8.95 },
          { name: 'Fried Tofu', description: 'Crispy tofu with dipping sauce.', price: 7.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Chick-fil-A @ UTC', address: '4127 Campus Dr, Irvine, CA 92612', coords: [-117.8385, 33.6488] },
    restaurant: 'Chick-fil-A @ UTC',
    restaurant_url: 'https://www.chick-fil-a.com/menu',
    address: '4127 Campus Dr, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Chicken, Fast Food',
    attribute_tags: 'UTC, University Center, UCI Demo',
    latitude_coordinates: 33.6488,
    longitude_coordinates: -117.8385,
    menu_items: [
      {
        name: 'Chicken',
        items: [
          { name: 'Chicken Sandwich', description: 'Breaded chicken filet with pickles on a bun.', price: 6.25 },
          { name: 'Spicy Chicken Sandwich', description: 'Spicy breaded chicken filet with pickles on a bun.', price: 6.65 },
          { name: 'Nuggets 8-count', description: 'Breaded chicken nuggets.', price: 6.25 },
          { name: 'Waffle Potato Fries', description: 'Waffle-cut fries.', price: 3.25 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Chipotle @ UTC', address: '4255 Campus Dr, Irvine, CA 92612', coords: [-117.8405, 33.6497] },
    restaurant: 'Chipotle @ UTC',
    restaurant_url: 'https://www.chipotle.com/menu',
    address: '4255 Campus Dr, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Mexican, Bowls, Burritos',
    attribute_tags: 'UTC, University Center, UCI Demo',
    latitude_coordinates: 33.6497,
    longitude_coordinates: -117.8405,
    menu_items: [
      {
        name: 'Entrees',
        items: [
          { name: 'Chicken Burrito Bowl', description: 'Chicken, rice, beans, salsa, cheese, and toppings.', price: 11.95 },
          { name: 'Steak Burrito', description: 'Steak, rice, beans, salsa, cheese, and toppings in a tortilla.', price: 13.45 },
          { name: 'Sofritas Bowl', description: 'Plant-based sofritas with rice, beans, salsa, and toppings.', price: 11.95 },
          { name: 'Chips and Guacamole', description: 'Tortilla chips with guacamole.', price: 5.25 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Yogurtland @ UTC', address: '4187 Campus Dr, Irvine, CA 92612', coords: [-117.8397, 33.6493] },
    restaurant: 'Yogurtland @ UTC',
    restaurant_url: 'https://www.yogurt-land.com/',
    address: '4187 Campus Dr, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Dessert, Frozen Yogurt',
    attribute_tags: 'UTC, University Center, UCI Demo',
    latitude_coordinates: 33.6493,
    longitude_coordinates: -117.8397,
    menu_items: [
      {
        name: 'Frozen Yogurt',
        items: [
          { name: 'Vanilla Frozen Yogurt Cup', description: 'Classic vanilla frozen yogurt with toppings.', price: 6.95 },
          { name: 'Chocolate Frozen Yogurt Cup', description: 'Chocolate frozen yogurt with toppings.', price: 6.95 },
          { name: 'Tart Frozen Yogurt Cup', description: 'Original tart frozen yogurt with fruit.', price: 6.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Sgt. Pepperoni’s Pizza @ Campus Plaza', address: '4533 Campus Dr, Irvine, CA 92612', coords: [-117.8296, 33.6503] },
    restaurant: 'Sgt. Pepperoni’s Pizza @ Campus Plaza',
    restaurant_url: 'https://sgtpepperonis.com/',
    address: '4533 Campus Dr, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Pizza, Italian',
    attribute_tags: 'Campus Plaza, Irvine Company, UCI Demo',
    latitude_coordinates: 33.6503,
    longitude_coordinates: -117.8296,
    menu_items: [
      {
        name: 'Pizza',
        items: [
          { name: 'Pepperoni Pizza Slice', description: 'Classic pepperoni pizza slice.', price: 4.95 },
          { name: 'Cheese Pizza Slice', description: 'Classic cheese pizza slice.', price: 4.5 },
          { name: 'The Works Pizza', description: 'Pizza with pepperoni, sausage, vegetables, and cheese.', price: 24.95 },
          { name: 'Garlic Knots', description: 'Garlic knots with marinara.', price: 6.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'The Buffalo Spot @ Campus Plaza', address: '4501 Campus Dr, Irvine, CA 92612', coords: [-117.8302, 33.6505] },
    restaurant: 'The Buffalo Spot @ Campus Plaza',
    restaurant_url: 'https://www.thebuffalospot.com/',
    address: '4501 Campus Dr, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Wings, Chicken, Fast Casual',
    attribute_tags: 'Campus Plaza, Irvine Company, UCI Demo',
    latitude_coordinates: 33.6505,
    longitude_coordinates: -117.8302,
    menu_items: [
      {
        name: 'Wings & Fries',
        items: [
          { name: 'Buffalo Fries', description: 'Fries topped with chicken, sauce, ranch, and cheese.', price: 12.95 },
          { name: 'Traditional Wings', description: 'Bone-in wings with choice of sauce.', price: 13.95 },
          { name: 'Boneless Wings', description: 'Boneless wings with choice of sauce.', price: 12.95 },
          { name: 'Chicken Tenders', description: 'Chicken tenders with dipping sauce.', price: 10.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Jersey Mike’s Subs @ Campus Plaza', address: 'Campus Plaza, Irvine, CA 92612', coords: [-117.8292, 33.6501] },
    restaurant: 'Jersey Mike’s Subs @ Campus Plaza',
    restaurant_url: 'https://www.jerseymikes.com/menu',
    address: 'Campus Plaza, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Sandwiches, Subs',
    attribute_tags: 'Campus Plaza, Irvine Company, UCI Demo',
    latitude_coordinates: 33.6501,
    longitude_coordinates: -117.8292,
    menu_items: [
      {
        name: 'Subs',
        items: [
          { name: 'Turkey and Provolone Sub', description: 'Turkey, provolone, lettuce, tomato, onion, and dressing.', price: 10.95 },
          { name: 'Original Italian Sub', description: 'Provolone, ham, prosciuttini, cappacuolo, salami, and pepperoni.', price: 11.95 },
          { name: 'Club Sub', description: 'Turkey, ham, provolone, bacon, and mayo.', price: 12.45 },
          { name: 'Big Kahuna Cheese Steak', description: 'Grilled steak with peppers, onions, mushrooms, jalapenos, and cheese.', price: 12.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'I Heart Pancakes @ Campus Plaza', address: 'Campus Plaza, Irvine, CA 92612', coords: [-117.829, 33.6504] },
    restaurant: 'I Heart Pancakes @ Campus Plaza',
    restaurant_url: 'https://www.iheartpancakes.com/',
    address: 'Campus Plaza, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Breakfast, Pancakes, Brunch',
    attribute_tags: 'Campus Plaza, Irvine Company, UCI Demo',
    latitude_coordinates: 33.6504,
    longitude_coordinates: -117.829,
    menu_items: [
      {
        name: 'Breakfast',
        items: [
          { name: 'Buttermilk Pancakes', description: 'Stack of pancakes with butter and syrup.', price: 10.95 },
          { name: 'Chicken and Waffles', description: 'Fried chicken with waffles and syrup.', price: 15.95 },
          { name: 'Breakfast Burrito', description: 'Eggs, cheese, potatoes, and choice of meat in a tortilla.', price: 12.95 },
          { name: 'Avocado Toast', description: 'Toast with avocado, eggs, and seasoning.', price: 11.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Botan Sushi @ Campus Plaza', address: 'Campus Plaza, Irvine, CA 92612', coords: [-117.8288, 33.6502] },
    restaurant: 'Botan Sushi @ Campus Plaza',
    restaurant_url: 'https://www.botansushi.com/',
    address: 'Campus Plaza, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Sushi, Japanese',
    attribute_tags: 'Campus Plaza, Irvine Company, UCI Demo',
    latitude_coordinates: 33.6502,
    longitude_coordinates: -117.8288,
    menu_items: [
      {
        name: 'Sushi',
        items: [
          { name: 'California Roll', description: 'Crab-style roll with avocado and cucumber.', price: 8.95 },
          { name: 'Spicy Tuna Roll', description: 'Tuna roll with spicy sauce.', price: 10.95 },
          { name: 'Salmon Nigiri', description: 'Salmon over sushi rice.', price: 7.95 },
          { name: 'Chicken Teriyaki Bowl', description: 'Chicken teriyaki with rice and vegetables.', price: 12.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Hen House Grill @ Campus Plaza', address: '4515 Campus Dr, Irvine, CA 92612', coords: [-117.8298, 33.6506] },
    restaurant: 'Hen House Grill @ Campus Plaza',
    restaurant_url: 'https://www.henhousegrill.com/',
    address: '4515 Campus Dr, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Persian, Mediterranean, Grill',
    attribute_tags: 'Campus Plaza, UCI Demo',
    latitude_coordinates: 33.6506,
    longitude_coordinates: -117.8298,
    menu_items: [
      {
        name: 'Persian Grill',
        items: [
          { name: 'Chicken Kabob Plate', description: 'Chicken kabob with rice, grilled tomato, and salad.', price: 16.95 },
          { name: 'Koobideh Plate', description: 'Ground beef kabob with rice, grilled tomato, and salad.', price: 15.95 },
          { name: 'Falafel Plate', description: 'Falafel with rice, salad, hummus, and pita.', price: 13.95 },
          { name: 'Shirazi Salad', description: 'Cucumber, tomato, onion, herbs, and lemon dressing.', price: 6.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Yupdduk Irvine @ Campus Plaza', address: 'Campus Plaza, Irvine, CA 92612', coords: [-117.8294, 33.6507] },
    restaurant: 'Yupdduk Irvine @ Campus Plaza',
    restaurant_url: 'https://www.yupdduk.com/',
    address: 'Campus Plaza, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Korean, Street Food',
    attribute_tags: 'Campus Plaza, UCI Demo',
    latitude_coordinates: 33.6507,
    longitude_coordinates: -117.8294,
    menu_items: [
      {
        name: 'Korean Street Food',
        items: [
          { name: 'Yupdduk Tteokbokki', description: 'Spicy rice cakes with fish cake and sauce.', price: 17.95 },
          { name: 'Rosé Tteokbokki', description: 'Creamy spicy rice cakes with toppings.', price: 18.95 },
          { name: 'Kimbap', description: 'Korean rice roll with vegetables and protein.', price: 9.95 },
          { name: 'Fried Dumplings', description: 'Fried dumplings with dipping sauce.', price: 8.95 },
        ],
      },
    ],
  },
  {
    _id: { restaurant_name: 'Saffron & Rose @ Campus Plaza', address: 'Campus Plaza, Irvine, CA 92612', coords: [-117.8287, 33.6505] },
    restaurant: 'Saffron & Rose @ Campus Plaza',
    restaurant_url: 'https://www.saffronrosepersianicecream.com/',
    address: 'Campus Plaza, Irvine, CA 92612',
    city: 'Irvine',
    state: 'CA',
    cuisine_tags: 'Dessert, Persian Ice Cream',
    attribute_tags: 'Campus Plaza, UCI Demo',
    latitude_coordinates: 33.6505,
    longitude_coordinates: -117.8287,
    menu_items: [
      {
        name: 'Ice Cream',
        items: [
          { name: 'Saffron Pistachio Ice Cream', description: 'Persian ice cream with saffron and pistachio.', price: 6.95 },
          { name: 'Rosewater Ice Cream', description: 'Rosewater flavored ice cream.', price: 6.95 },
          { name: 'Faloodeh', description: 'Persian frozen dessert with noodles and syrup.', price: 7.95 },
        ],
      },
    ],
  },
]

const FOOD_IMAGE_URLS = {
  acai: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
  avocadoToast: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  bagel: 'https://www.einsteinbros.com/wp-content/uploads/2023/10/EBB-Baconcheddar-Classic-Egg-Sandwich-1.jpg',
  boba: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80',
  bowl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  burrito: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
  breakfastBurrito: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
  buffaloFries: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80',
  chickenSandwich: 'https://www.chick-fil-a.com/wp-content/uploads/sites/2/2025/12/Chick-fil-A-Chicken-Sandwich-plp-newstalgia-patch.png?w=744',
  chickenTenders: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80',
  chinese: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
  chowMein: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  cookie: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
  croissant: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
  dessert: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  dumplings: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
  falafel: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  fries: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80',
  garlicKnots: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  gyro: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
  hashBrown: 'https://www.einsteinbros.com/wp-content/uploads/2023/10/EBB-Twice-Baked-Hashbrown.jpg',
  iceCream: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  kabob: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  korean: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?auto=format&fit=crop&w=800&q=80',
  mediterranean: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  noodles: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  orangeChicken: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
  pancakes: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80',
  parfait: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  poke: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  smoothie: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
  sushi: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
  teriyaki: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  tteokbokki: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?auto=format&fit=crop&w=800&q=80',
  tofu: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  vegetarian: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  wrap: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
  wings: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80',
}

const ITEM_IMAGE_OVERRIDES = {
  'anteater burger': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80',
  'loaded fries': 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80',
  'caesar salad': 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',

  'bacon egg and cheese bagel': 'https://www.einsteinbros.com/wp-content/uploads/2023/10/EBB-Baconcheddar-Classic-Egg-Sandwich-1.jpg',
  'nova lox bagel': 'https://www.einsteinbros.com/wp-content/uploads/2023/10/EBB-Novalox.jpg',
  'avocado toast bagel': FOOD_IMAGE_URLS.avocadoToast,
  'hash brown side': 'https://www.einsteinbros.com/wp-content/uploads/2023/10/EBB-Twice-Baked-Hashbrown.jpg',

  'turkey sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  'chicken caesar wrap': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
  'greek yogurt parfait': FOOD_IMAGE_URLS.parfait,
  'hummus snack box': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',

  'not so fried chicken sandwich': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=800&q=80',
  'avocado quinoa superfood ensalada': FOOD_IMAGE_URLS.salad,
  'turkey avo salsa verde': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  'thai mango salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',

  'chicken kabob plate': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  'gyro meat plate': 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
  'falafel plate': FOOD_IMAGE_URLS.falafel,
  'santorini bowl': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',

  'in n out burger utc double double': '/demo-images/in-n-out/double-double.jpg',
  'in n out burger utc cheeseburger': '/demo-images/in-n-out/cheeseburger.jpg',
  'in n out burger utc hamburger': '/demo-images/in-n-out/hamburger.jpg',
  'in n out burger utc french fries': '/demo-images/in-n-out/fries.jpg',
  'double double': '/demo-images/in-n-out/double-double.jpg',
  cheeseburger: '/demo-images/in-n-out/cheeseburger.jpg',
  hamburger: '/demo-images/in-n-out/hamburger.jpg',
  'french fries': '/demo-images/in-n-out/fries.jpg',

  'build your own pizza': 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80',
  'bbq chicken pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
  'meat eater pizza': 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=800&q=80',
  'simple pie': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',

  'bulgogi beef bowl': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
  'spicy pork bowl': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
  'chicken gogi bowl': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
  'kimchi fried rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',

  'beef noodle soup': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  'pork soup dumplings': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
  'dan dan noodles': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80',
  'scallion pancake': 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=800&q=80',
  'pork dumplings': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
  'chicken dumplings': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=80',
  'dumpling bowl': 'https://images.unsplash.com/photo-1630409351217-bc4fa6422075?auto=format&fit=crop&w=800&q=80',
  'garlic noodles': FOOD_IMAGE_URLS.noodles,

  'almond milk tea': FOOD_IMAGE_URLS.boba,
  'thai tea': 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80',
  'popcorn chicken': FOOD_IMAGE_URLS.chickenTenders,
  'fried tofu': FOOD_IMAGE_URLS.tofu,

  'chicken sandwich': 'https://www.chick-fil-a.com/wp-content/uploads/sites/2/2025/12/Chick-fil-A-Chicken-Sandwich-plp-newstalgia-patch.png?w=744',
  'spicy chicken sandwich': 'https://www.chick-fil-a.com/wp-content/uploads/sites/2/2025/06/CFASpicySandwich_800.png?w=744',
  'nuggets 8 count': 'https://www.chick-fil-a.com/wp-content/uploads/sites/2/2025/06/nuggets_8ct_PDP_Desk.png?w=744',
  'waffle potato fries': 'https://www.chick-fil-a.com/wp-content/uploads/sites/2/2025/05/cfa14300winter24_medium_fries_plp_hero_d710x580_jpg_master_jpg.jpg',

  'chicken burrito bowl': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'steak burrito': FOOD_IMAGE_URLS.burrito,
  'sofritas bowl': FOOD_IMAGE_URLS.vegetarian,
  'chips and guacamole': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=800&q=80',

  'vanilla frozen yogurt cup': FOOD_IMAGE_URLS.iceCream,
  'chocolate frozen yogurt cup': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  'tart frozen yogurt cup': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',

  'pepperoni pizza slice': 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=800&q=80',
  'cheese pizza slice': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  'the works pizza': 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80',
  'garlic knots': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',

  'buffalo fries': FOOD_IMAGE_URLS.buffaloFries,
  'traditional wings': FOOD_IMAGE_URLS.wings,
  'boneless wings': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=800&q=80',
  'chicken tenders': FOOD_IMAGE_URLS.chickenTenders,

  'turkey and provolone sub': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  'original italian sub': 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
  'club sub': 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=800&q=80',
  'big kahuna cheese steak': 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80',

  'buttermilk pancakes': FOOD_IMAGE_URLS.pancakes,
  'chicken and waffles': 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80',
  'breakfast burrito': FOOD_IMAGE_URLS.breakfastBurrito,
  'avocado toast': FOOD_IMAGE_URLS.avocadoToast,

  'bento sushi uci california roll': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
  'bento sushi uci spicy tuna roll': 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
  'bento sushi uci salmon avocado roll': 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80',
  'bento sushi uci vegetable roll': 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=800&q=80',
  'botan sushi campus plaza california roll': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
  'botan sushi campus plaza spicy tuna roll': 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
  'salmon nigiri': 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80',
  'california roll': FOOD_IMAGE_URLS.sushi,
  'spicy tuna roll': 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
  'salmon avocado roll': 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80',
  'vegetable roll': 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=800&q=80',
  'chicken teriyaki bowl': FOOD_IMAGE_URLS.teriyaki,
  'poke bowl': FOOD_IMAGE_URLS.poke,

  'koobideh plate': 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80',
  'shirazi salad': FOOD_IMAGE_URLS.salad,
  'yupdduk tteokbokki': FOOD_IMAGE_URLS.tteokbokki,
  'rose tteokbokki': 'https://images.unsplash.com/photo-1630409351217-bc4fa6422075?auto=format&fit=crop&w=800&q=80',
  kimbap: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80',
  'fried dumplings': FOOD_IMAGE_URLS.dumplings,

  'saffron pistachio ice cream': FOOD_IMAGE_URLS.iceCream,
  'rosewater ice cream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  faloodeh: FOOD_IMAGE_URLS.dessert,

  'turkey breast 6 inch': 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=800&q=80',
  'italian b m t 6 inch': 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
  'veggie delite 6 inch': 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80',
  'tuna 6 inch': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  'rotisserie chicken protein bowl': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',

  'caffe latte': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  'iced brown sugar oatmilk shaken espresso': 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
  'cold brew': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
  'spinach feta egg white wrap': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
  'turkey bacon cheddar sandwich': 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=800&q=80',

  'mango a go go': FOOD_IMAGE_URLS.smoothie,
  'strawberries wild': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
  razzmatazz: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80',
  'acai super antioxidant': FOOD_IMAGE_URLS.acai,
  'acai primo bowl': FOOD_IMAGE_URLS.acai,
  'vanilla blue sky bowl': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',

  'zot n go market hummus snack box': 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=800&q=80',
  'mendocino farms utc avocado quinoa superfood ensalada': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  'mendocino farms utc thai mango salad': 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=800&q=80',

  'luna grill utc chicken kabob plate': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  'luna grill utc falafel plate': 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=800&q=80',
  'luna grill utc santorini bowl': 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=800&q=80',
  'hen house grill campus plaza chicken kabob plate': 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80',
  'hen house grill campus plaza falafel plate': 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=800&q=80',

  'bento sushi uci chicken teriyaki bowl': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
  'bento sushi uci poke bowl': 'https://images.unsplash.com/photo-1764306806140-f7d2cd694f00?auto=format&fit=crop&w=800&q=80',
  'botan sushi campus plaza chicken teriyaki bowl': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',

  'chipotle utc chicken burrito bowl': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
  'chipotle utc steak burrito': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=800&q=80',
  'chipotle utc sofritas bowl': 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80',

  'yogurtland utc vanilla frozen yogurt cup': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
  'yogurtland utc chocolate frozen yogurt cup': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
  'yogurtland utc tart frozen yogurt cup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  'saffron rose campus plaza saffron pistachio ice cream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  'saffron rose campus plaza rosewater ice cream': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
  'saffron rose campus plaza faloodeh': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',

  'orange chicken bowl': FOOD_IMAGE_URLS.orangeChicken,
  'broccoli beef bowl': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
  'kung pao chicken plate': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80',
  'honey walnut shrimp plate': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80',
  'fried rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
  'chocolate chip cookie': FOOD_IMAGE_URLS.cookie,
  'butter croissant': FOOD_IMAGE_URLS.croissant,
}

function normalizeImageLookup(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[’']/gu, '')
    .replace(/[^a-z0-9]+/gu, ' ')
    .trim()
}

function getFoodImageKey(item, category, restaurant) {
  const text = [item?.name, item?.description, category].filter(Boolean).join(' ').toLowerCase()

  if (/acai|açaí/u.test(text)) return 'acai'
  if (/avocado toast/u.test(text)) return 'avocadoToast'
  if (/hash brown/u.test(text)) return 'hashBrown'
  if (/bacon egg and cheese bagel|egg.*cheese.*bagel|nova lox|lox bagel/u.test(text)) return 'bagel'
  if (/teriyaki/u.test(text)) return 'teriyaki'
  if (/wrap/u.test(text)) return 'wrap'
  if (/poke/u.test(text)) return 'poke'
  if (/sushi|roll|nigiri/u.test(text)) return 'sushi'
  if (/chicken sandwich|spicy chicken sandwich/u.test(text)) return 'chickenSandwich'
  if (/sandwich|sub|b\.m\.t|turkey|italian|tuna|jersey mike/u.test(text)) return 'sandwich'
  if (/garlic knots/u.test(text)) return 'garlicKnots'
  if (/pizza|pepperoni|cheese slice/u.test(text)) return 'pizza'
  if (/burger|double-double|cheeseburger|hamburger/u.test(text)) return 'burger'
  if (/breakfast burrito/u.test(text)) return 'breakfastBurrito'
  if (/burrito|chipotle|taco|guacamole|quesadilla/u.test(text)) return 'burrito'
  if (/protein bowl/u.test(text)) return 'bowl'
  if (/nuggets|tenders|popcorn chicken/u.test(text)) return 'chickenTenders'
  if (/wings|buffalo/u.test(text)) return 'wings'
  if (/orange chicken/u.test(text)) return 'orangeChicken'
  if (/chow mein/u.test(text)) return 'chowMein'
  if (/kung pao|broccoli beef|honey walnut|fried rice/u.test(text)) return 'chinese'
  if (/bulgogi|kimchi|gogi|tteokbokki|kimbap|korean/u.test(text)) return 'korean'
  if (/dumpling|soup dumplings|scallion pancake/u.test(text)) return 'dumplings'
  if (/ice cream|frozen yogurt|yogurt|faloodeh/u.test(text)) return 'iceCream'
  if (/dan dan|noodle/u.test(text)) return 'noodles'
  if (/kabob|koobideh/u.test(text)) return 'kabob'
  if (/gyro/u.test(text)) return 'gyro'
  if (/falafel/u.test(text)) return 'falafel'
  if (/mediterranean|persian|shirazi/u.test(text)) return 'mediterranean'
  if (/tofu/u.test(text)) return 'tofu'
  if (/hummus|snack box/u.test(text)) return 'vegetarian'
  if (/salad|quinoa|avocado|grain bowl|veggie|vegetable/u.test(text)) return 'salad'
  if (/smoothie|jamba|mango|strawberr/u.test(text)) return 'smoothie'
  if (/coffee|latte|espresso|cold brew|starbucks/u.test(text)) return 'coffee'
  if (/milk tea|thai tea|boba|tea/u.test(text)) return 'boba'
  if (/bagel|lox/u.test(text)) return 'bagel'
  if (/pancake|waffle/u.test(text)) return 'pancakes'
  if (/parfait/u.test(text)) return 'parfait'
  if (/breakfast|egg/u.test(text)) return 'breakfast'
  if (/cookie/u.test(text)) return 'cookie'
  if (/croissant/u.test(text)) return 'croissant'
  if (/dessert/u.test(text)) return 'dessert'
  if (/fries|loaded fries/u.test(text)) return 'fries'
  if (/bowl|plate/u.test(text)) return 'bowl'

  return 'bowl'
}

function getFoodImageUrl(item, category, restaurant) {
  const restaurantOverride = ITEM_IMAGE_OVERRIDES[normalizeImageLookup(`${restaurant || ''} ${item?.name || ''}`)]
  if (restaurantOverride) return restaurantOverride

  const override = ITEM_IMAGE_OVERRIDES[normalizeImageLookup(item?.name)]
  if (override) return override

  return FOOD_IMAGE_URLS[getFoodImageKey(item, category, restaurant)] || FOOD_IMAGE_URLS.bowl
}

function withDemoItemImages(doc) {
  return {
    ...doc,
    menu_items: (doc.menu_items || []).map(section => ({
      ...section,
      items: (section.items || []).map(item => ({
        ...item,
        item_image: item.item_image || item.image_url || getFoodImageUrl(item, section.name, doc.restaurant),
      })),
    })),
  }
}

export function getLocalDemoMenuDocuments() {
  return localDemoMenuDocuments.map(withDemoItemImages)
}

export function getDocumentRestaurantName(doc) {
  return doc.restaurant || doc?._id?.restaurant_name || ''
}

export function getDocumentCoordinates(doc) {
  const nestedCoords = Array.isArray(doc?._id?.coords) ? doc._id.coords : null
  const geoJsonCoords = Array.isArray(doc?.location?.coordinates) ? doc.location.coordinates : null
  const fallbackCoords = nestedCoords || geoJsonCoords
  const longitude = fallbackCoords?.[0] ?? doc.longitude_coordinates
  const latitude = fallbackCoords?.[1] ?? doc.latitude_coordinates

  return {
    latitude: Number(latitude),
    longitude: Number(longitude),
  }
}

export function localDocumentMatchesBounds(doc, bounds) {
  if (!bounds) return true

  const { latitude, longitude } = getDocumentCoordinates(doc)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false
  if (latitude < bounds.south || latitude > bounds.north) return false

  if (bounds.west <= bounds.east) {
    return longitude >= bounds.west && longitude <= bounds.east
  }

  return longitude >= bounds.west || longitude <= bounds.east
}

export function localDocumentMatchesSearch(doc, query) {
  const normalizedQuery = String(query || '').trim().toLowerCase()
  if (!normalizedQuery) return true

  const haystack = [
    doc.restaurant,
    doc?._id?.restaurant_name,
    doc.address,
    doc.city,
    doc.state,
    doc.cuisine_tags,
    doc.attribute_tags,
    ...(doc.menu_items || []).flatMap(section => [
      section.name,
      section.desc,
      ...(section.items || []).flatMap(item => [item.name, item.description]),
    ]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(normalizedQuery)
}

export function localDocumentMatchesNames(doc, names) {
  if (!Array.isArray(names) || names.length === 0) return true

  const restaurantName = getDocumentRestaurantName(doc)
  return names.includes(restaurantName)
}

export function localDocumentMatchesRestaurant(doc, restaurant) {
  const normalizedRestaurant = String(restaurant || '').trim()
  if (!normalizedRestaurant) return true

  return getDocumentRestaurantName(doc) === normalizedRestaurant
}
