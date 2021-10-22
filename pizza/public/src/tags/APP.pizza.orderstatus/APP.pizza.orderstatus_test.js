//  ========================================================================
/**
 * @copyright Copyright (C) 2021, the AUTHORS. All Rights Reserved.
 */
//  ========================================================================

/*
 * APP.pizza:orderstatus top-level tests.
 */

//  ------------------------------------------------------------------------

APP.pizza.orderstatus.Type.describe('APP.pizza:orderstatus',
function() {

    this.it('Is a TP.tag.ComputedTag tag', function(test, options) {
        test.assert.isKindOf(APP.pizza.orderstatus,
            'TP.tag.ComputedTag');
    });
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
