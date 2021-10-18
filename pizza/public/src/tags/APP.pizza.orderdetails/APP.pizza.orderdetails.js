//  ========================================================================
/**
 * @type APP.pizza.orderdetails
 * @summary Tag type which manages display of the order details (name, phone,
 *     pizzas, sides, etc).
 */
//  ------------------------------------------------------------------------

TP.tag.TemplatedTag.defineSubtype('APP.pizza:orderdetails');

APP.pizza.orderdetails.defineAttribute('themeURI', TP.NO_RESULT);

//  ------------------------------------------------------------------------
//  Type Methods
//  ------------------------------------------------------------------------

APP.pizza.orderdetails.Type.defineMethod('initialize',
function() {

    /**
     * @method initialize
     * @summary Performs one-time setup for the type on startup/import. Note
     *     that there are no parameters, you do not callNextMethod, and there's
     *     no return value. Type initializers are invoked one-by-one.
     * @listens {OrderChange}
     */

    this.observe(TP.sys.getApplication(), 'OrderChange');
});

//  ------------------------------------------------------------------------

APP.pizza.orderdetails.Type.defineMethod('enableOrderButton',
function(aFlag = true) {

    /**
     * @method enableOrderButton
     * @summary Enables/disables the "Order Now" button based on the value of
     *     the flag provided.
     * @param {Boolean} [aFlag=true] False to explicitly disable the button.
     * @returns {APP.pizza.orderdetails} The receiver.
     */

    let button;

    button = TP.byCSSPath('pizza|orderdetails > footer > button[name="order"]',
        null, true, true);
    if (TP.notValid(button)) {
        return this;
    }

    TP.notFalse(aFlag) ? button.enable() : button.disable();

    return this;
});

//  ------------------------------------------------------------------------

APP.pizza.orderdetails.Type.defineMethod('isOrderingPossible',
function(anOrder) {

    /**
     * @method isOrderingPossible
     * @summary Returns true if ordering is possible. This requires the order to
     *     be sufficient and to be in a viable state for ordering (e.g. not already
     *     ordered and awaiting fulfillment).
     * @param {Object} anOrder A plain JS Object containing order fields.
     * @returns {Boolean} True if initiating the order is possible.
     */

    //  If the order isn't sufficient (not enough info, no product(s), etc) we
    //  can't place an order.
    if (!this.isOrderSufficient(anOrder)) {
        return false;
    }

    //  If the order has already been placed (status = 'pending') then we want
    //  to disable the button. They can cancel the order or clear but not create
    //  a duplicate order.
    return anOrder.status !== 'pending';
});

//  ------------------------------------------------------------------------

APP.pizza.orderdetails.Type.defineMethod('isOrderSufficient',
function(anOrder) {

    /**
     * @method isOrderSufficient
     * @summary Returns true if the order is sufficient, meaning it has at least
     *     the minimum amount of data to produce a viable order.
     * @param {Object} anOrder A plain JS Object containing order fields.
     * @returns {Boolean} True if the order is sufficient.
     */

    //  Must have name, phone, and at least one purchase item.
    if (TP.isEmpty(anOrder.name) || TP.isEmpty(anOrder.phone) ||
            TP.isEmpty(anOrder.pizzas) && TP.isEmpty(anOrder.sides)) {
        return false;
    }

    return true;
});

//  ------------------------------------------------------------------------
//  Type Handlers
//  ------------------------------------------------------------------------

APP.pizza.orderdetails.Type.defineHandler('OrderChange',
function(aSignal) {

    /**
     * @method handleOrderChange
     * @summary Responds to notices that the order information has changed. Most
     *     UI changes related to order data are managed via bind: however we
     *     handle button configuration in the code as order status changes.
     * @param {TP.sig.Signal} aSignal The signal.
     */

    let order;

    order = aSignal.getPayload();

    this.enableOrderButton(this.isOrderingPossible(order));
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
