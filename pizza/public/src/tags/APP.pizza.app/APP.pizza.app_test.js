//  ========================================================================
/**
 * @copyright Copyright (C) 2021, the AUTHORS. All Rights Reserved.
 */
//  ========================================================================

/*
 * APP.pizza:app top-level tests.
 */

//  ------------------------------------------------------------------------

APP.pizza.app.Type.describe('APP.pizza:app', function() {

    this.it('Is a templated tag', function(test, options) {
        test.assert.isKindOf(APP.pizza.app, 'TP.tag.TemplatedTag');
    });
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
