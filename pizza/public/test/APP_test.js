//  ========================================================================
/**
 * @copyright Copyright (C) 2021, the AUTHORS. All Rights Reserved.
 */
//  ========================================================================

/*
 * APP pizza top-level tests.
 */

/* eslint dot-notation:0 */

//  ------------------------------------------------------------------------

APP.describe('APP', function() {

    this.it('Has a namespace', function(test, options) {
        test.assert.isNamespace(APP['pizza']);
    });

    this.it('Has an application type', function(test, options) {
        test.assert.isType(APP['pizza']['Application']);
    });
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
