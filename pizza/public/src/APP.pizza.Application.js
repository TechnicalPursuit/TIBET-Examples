//  ========================================================================
/**
 * @type APP.pizza.Application
 * @summary Handles top-level logic and data sharing for the application.
 */
//  ------------------------------------------------------------------------

TP.core.Application.defineSubtype('APP.pizza.Application');

//  Location used to share the Order data.
APP.pizza.Application.Type.defineConstant('orderURN', TP.uc('urn:app:order'));

//  Reference to the server-side URI we'll POST order requests to.
APP.pizza.Application.Type.defineConstant('serverURI', TP.uriExpandHome('/order'));

//  ------------------------------------------------------------------------
//  Inst Attributes
//  ------------------------------------------------------------------------

//  The order data. This is also shared as the content of the orderURN.
APP.pizza.Application.Inst.defineAttribute('order');

//  ------------------------------------------------------------------------
//  Inst Methods
//  ------------------------------------------------------------------------

APP.pizza.Application.Inst.defineMethod('clearOrder',
function(shouldSignal) {

    /**
     * @method clearOrder
     * @summary Clears the order, resetting it to base values.
     * @param {Boolean} shouldSignal Set to false to prevent signaling that the
     *     order has changed value(s).
     * @returns {APP.pizza.Application} The receiver.
     */

    this.set('order', {
        name: '',
        phone: '',
        pizzas: [],
        sides: []
    });

    if (TP.notFalse(shouldSignal)) {
        this.orderChanged();
    }

    return this;
});

//  ------------------------------------------------------------------------

APP.pizza.Application.Inst.defineMethod('getOrderURN',
function() {

    /**
     * @method getOrderURN
     * @summary Returns the URN used to share order data across components.
     * @returns {TP.uri.URN} The order URN instance.
     */

    return this.getType().get('orderURN');
});

//  ------------------------------------------------------------------------

APP.pizza.Application.Inst.defineMethod('getServerURI',
function() {

    /**
     * @method getServerURI
     * @summary Returns the server URI used to POST order data.
     * @returns {TP.uri.URI} The server order URI endpoint instance.
     */

    return this.getType().get('serverURI');
});

//  ------------------------------------------------------------------------

APP.pizza.Application.Inst.defineMethod('orderChanged',
function() {

    /**
     * @method orderChanged
     * @summary Updates the URN used to share order data across components and
     *     signals OrderChange.
     * @fires {OrderChange}
     * @returns {APP.pizza.Application} The receiver.
     */

    let order;

    order = this.get('order');

    APP.info(order);

    this.getType().get('orderURN').setContent(order);
    this.signal('OrderChange', order);

    return this;
});

//  ------------------------------------------------------------------------
//  Inst Handlers
//  ------------------------------------------------------------------------

APP.pizza.Application.Inst.defineHandler('AppDidStart',
function(aSignal) {

    /**
     * @method handleAppDidStart
     * @summary Responds to notification that the application has started. In
     *     particular, this invocation ensures the order is properly initialized
     *     and ready to capture data.
     * @param {TP.sig.Signal} aSignal The signal.
     */

    this.clearOrder();
});

//  ------------------------------------------------------------------------

APP.pizza.Application.Inst.defineHandler('AddPizza',
function(aSignal) {

    /**
     * @method handleAddPizza
     * @summary Responds to requests to add a new pizza to the current order.
     * @param {TP.sig.Signal} aSignal The signal.
     */

    let order,
        pizza;

    order = this.get('order');

    pizza = aSignal.getPayload();
    order.pizzas.push(pizza);

    this.orderChanged();
});

//  ------------------------------------------------------------------------

APP.pizza.Application.Inst.defineHandler('AddSides',
function(aSignal) {

    /**
     * @method handleAddSides
     * @summary Responds to requests to add one or more sides/extras to the
     *     current order.
     * @param {TP.sig.Signal} aSignal The signal.
     */

    let order,
        sides;

    order = this.get('order');

    sides = aSignal.getPayload();
    if (TP.isEmpty(sides)) {
        return;
    }
    order.sides.push(...sides);
    order.sides.unique();

    this.orderChanged();
});

//  ------------------------------------------------------------------------

APP.pizza.Application.Inst.defineHandler('ClearOrder',
function(aSignal) {

    /**
     * @method handleClearOrder
     * @summary Responds to requests to reset the order to a blank state.
     * @param {TP.sig.Signal} aSignal The signal.
     */

    this.clearOrder();
});

//  ------------------------------------------------------------------------

APP.pizza.Application.Inst.defineHandler('SendOrder',
function(aSignal) {

    /**
     * @method handleSendOrder
     * @summary Responds to requests to send the order to the server for
     *     processing.
     * @param {TP.sig.Signal} aSignal The signal.
     */

    let order,
        request;

    order = this.get('order');

    //  Ensure we clear any status flag from prior state (such as pending or
    //  cancelled) since we allow server response fields in the order.
    delete order.status;

    //  Prep the request as a JSON string and prevent any further encoding.
    request = TP.hc('body', TP.json(order), 'noencode', true);
    APP.debug(request);

    //  Send to the server endpoint and handle success/failure. NOTE that using
    //  an arrow function here walks up the scope chain for 'this' resolution.
    TP.httpPost(this.getType().get('serverURI'), request).then((result) => {
        APP.debug(result);
        //  Update our order with the augmented (order status & time) order.
        this.set('order', JSON.parse(result));
        this.orderChanged();
    }).catch((err) => {
        //  Log any error but don't clear the order so we can resend etc.
        APP.debug(err);
    });
});

//  ------------------------------------------------------------------------

APP.pizza.Application.Inst.defineHandler('UpdateOrderInfo',
function(aSignal) {

    /**
     * @method handleUpdateOrderInfo
     * @summary Responds to requests to update the order with additional info.
     * @param {TP.sig.Signal} aSignal The signal.
     */

    let order,
        data;

    order = this.get('order');

    //  Grab the new field(s) from the signal and overlay them.
    data = aSignal.getPayload();
    Object.assign(order, data);

    //  Notify observers of the order to refresh/re-render.
    this.orderChanged();
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
