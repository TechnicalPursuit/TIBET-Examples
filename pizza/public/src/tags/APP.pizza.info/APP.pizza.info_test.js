//  ========================================================================
/**
 * @copyright Copyright (C) 2021, the AUTHORS. All Rights Reserved.
 */
//  ========================================================================

/*
 * APP.pizza:info top-level tests.
 */

//  ------------------------------------------------------------------------

APP.pizza.info.Type.describe('APP.pizza:info',
function() {

    this.it('Is a TP.tag.TemplatedTag tag', function(test, options) {
        test.assert.isKindOf(APP.pizza.info,
            'TP.tag.TemplatedTag');
    });
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
