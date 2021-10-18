//  ========================================================================
/**
 * @copyright Copyright (C) 2021, the AUTHORS. All Rights Reserved.
 */
//  ========================================================================

/*
 * APP.pizza:order top-level tests.
 */

//  ------------------------------------------------------------------------

APP.pizza.order.Type.describe('APP.pizza:order',
function() {

    this.it('Is a TP.tag.TemplatedTag tag', function(test, options) {
        test.assert.isKindOf(APP.pizza.order,
            'TP.tag.TemplatedTag');
    });
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
