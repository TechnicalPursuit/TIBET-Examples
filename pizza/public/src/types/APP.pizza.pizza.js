APP.pizza.Object.defineSubtype('APP.pizza.pizza');

APP.pizza.pizza.Type.defineConstant('DEFAULT_SIZE', 'large');

APP.pizza.pizza.Type.defineConstant('SIZES', TP.ac('large', 'medium', 'small'));

APP.pizza.pizza.Type.defineConstant('TOPPINGS',
    TP.ac('ham', 'pineapple', 'mushrooms', 'sausage', 'spinach', 'jalepeno',
        'pepperoni', 'brocolli', 'feta'));

APP.pizza.pizza.Type.isAbstract(true);
