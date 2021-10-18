//  ========================================================================
/**
 * @copyright Copyright (C) 2021, the AUTHORS. All Rights Reserved.
 */
//  ========================================================================

/*
 * APP.pizza:pizza top-level tests.
 */

//  ------------------------------------------------------------------------

APP.pizza.pizza.Type.describe('APP.pizza.pizza',
function() {

    this.it('Is a APP.pizza.Object type', function(test, options) {
        test.assert.isKindOf(APP.pizza.pizza,
            'APP.pizza.Object');
    });
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
