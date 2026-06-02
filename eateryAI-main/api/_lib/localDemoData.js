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
  bagel: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  boba: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80',
  bowl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  burrito: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
  chicken: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80',
  chinese: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  dessert: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  dumplings: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
  fries: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80',
  iceCream: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  korean: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?auto=format&fit=crop&w=800&q=80',
  mediterranean: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  noodles: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  smoothie: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
  sushi: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
  vegetarian: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
}

function getFoodImageKey(item, category, restaurant) {
  const text = [item?.name, item?.description, category, restaurant].filter(Boolean).join(' ').toLowerCase()

  if (/acai|açaí/u.test(text)) return 'acai'
  if (/sandwich|sub|b\.m\.t|turkey|italian|tuna|jersey mike/u.test(text)) return 'sandwich'
  if (/pizza|pepperoni|cheese slice|garlic knots/u.test(text)) return 'pizza'
  if (/sushi|roll|nigiri|poke/u.test(text)) return 'sushi'
  if (/burger|double-double|cheeseburger|hamburger/u.test(text)) return 'burger'
  if (/burrito|chipotle|taco|guacamole|quesadilla/u.test(text)) return 'burrito'
  if (/chicken sandwich|nuggets|tenders|wings|buffalo|chick-fil-a/u.test(text)) return 'chicken'
  if (/orange chicken|kung pao|broccoli beef|honey walnut|chow mein|fried rice/u.test(text)) return 'chinese'
  if (/bulgogi|kimchi|gogi|tteokbokki|kimbap|korean/u.test(text)) return 'korean'
  if (/dumpling|soup dumplings|scallion pancake/u.test(text)) return 'dumplings'
  if (/dan dan|noodle/u.test(text)) return 'noodles'
  if (/kabob|gyro|falafel|mediterranean|persian|koobideh|shirazi/u.test(text)) return 'mediterranean'
  if (/salad|quinoa|avocado|grain bowl|veggie|vegetable/u.test(text)) return 'salad'
  if (/smoothie|jamba|mango|strawberr/u.test(text)) return 'smoothie'
  if (/coffee|latte|espresso|cold brew|starbucks/u.test(text)) return 'coffee'
  if (/milk tea|thai tea|boba|tea/u.test(text)) return 'boba'
  if (/bagel|lox/u.test(text)) return 'bagel'
  if (/breakfast|egg|hash brown|pancake|waffle|toast/u.test(text)) return 'breakfast'
  if (/ice cream|frozen yogurt|yogurt|faloodeh/u.test(text)) return 'iceCream'
  if (/cookie|croissant|dessert/u.test(text)) return 'dessert'
  if (/fries|loaded fries/u.test(text)) return 'fries'
  if (/tofu|hummus|snack box/u.test(text)) return 'vegetarian'
  if (/bowl|plate/u.test(text)) return 'bowl'

  return 'bowl'
}

function getFoodImageUrl(item, category, restaurant) {
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
