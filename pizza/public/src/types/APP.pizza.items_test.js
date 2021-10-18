//  ========================================================================
/**
 * @copyright Copyright (C) 2021, the AUTHORS. All Rights Reserved.
 */
//  ========================================================================

/*
 * APP.pizza:items top-level tests.
 */

//  ------------------------------------------------------------------------

APP.pizza.items.Type.describe('APP.pizza.items',
function() {

    this.it('Is a APP.pizza.Object type', function(test, options) {
        test.assert.isKindOf(APP.pizza.items,
            'APP.pizza.Object');
    });
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
