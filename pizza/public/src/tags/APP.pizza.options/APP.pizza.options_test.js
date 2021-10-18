//  ========================================================================
/**
 * @copyright Copyright (C) 2021, the AUTHORS. All Rights Reserved.
 */
//  ========================================================================

/*
 * APP.pizza:options top-level tests.
 */

//  ------------------------------------------------------------------------

APP.pizza.options.Type.describe('APP.pizza:options',
function() {

    this.it('Is a TP.tag.TemplatedTag tag', function(test, options) {
        test.assert.isKindOf(APP.pizza.options,
            'TP.tag.TemplatedTag');
    });
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
