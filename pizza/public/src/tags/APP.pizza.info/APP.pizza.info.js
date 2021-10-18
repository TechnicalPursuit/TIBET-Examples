//  ========================================================================
/**
 * @type APP.pizza.info
 * @summary Tag type handling the name/phone and related order info.
 */
//  ------------------------------------------------------------------------

TP.tag.TemplatedTag.defineSubtype('APP.pizza:info');

APP.pizza.info.defineAttribute('themeURI', TP.NO_RESULT);

//  ------------------------------------------------------------------------
//  Inst Attributes
//  ------------------------------------------------------------------------

//  Access path to the ordername input field.
APP.pizza.info.Inst.defineAttribute('nameInput',
    TP.cpc('input[type="text"][name="ordername"]',
        TP.hc('shouldCollapse', true)));

//  Access path to the phone input field.
APP.pizza.info.Inst.defineAttribute('phoneInput',
    TP.cpc('input[type="text"][name="phone"]',
        TP.hc('shouldCollapse', true)));

//  ------------------------------------------------------------------------

APP.pizza.info.Inst.defineMethod('init',
function() {

    /**
     * @method init
     * @summary Initialize new instances. In this application there should only
     *     be a single instance and we set it up to observe OrderChange so we
     *     can clear the information tracked by this tag.
     * @listens {OrderChange}
     * @returns {APP.pizza.info} The new instance.
     */

    this.callNextMethod();
    this.observe(TP.sys.getApplication(), 'OrderChange');

    return this;
});

//  ------------------------------------------------------------------------

APP.pizza.info.Inst.defineMethod('getOrderName',
function() {

    /**
     * @method getOrderName
     * @summary Returns the value of the nameInput field.
     * @returns {String} The field value.
     */

    return this.get('nameInput').getValue();
});

//  ------------------------------------------------------------------------

APP.pizza.info.Inst.defineMethod('getOrderPhone',
function() {

    /**
     * @method getOrderPhone
     * @summary Returns the value of the phoneInput field.
     * @returns {String} The field value.
     */

    return this.get('phoneInput').getValue();
});

//  ------------------------------------------------------------------------

APP.pizza.info.Inst.defineMethod('setOrderName',
function(aValue) {

    /**
     * @method setOrderName
     * @summary Updates the nameInput field with the supplied value.
     * @param {String} aValue The new name value to set.
     * @returns {String} The set value.
     */

    return this.get('nameInput').setValue(aValue || '');
});

//  ------------------------------------------------------------------------

APP.pizza.info.Inst.defineMethod('setOrderPhone',
function(aValue) {

    /**
     * @method setOrderPhone
     * @summary Updates the phoneInput field with the supplied value.
     * @param {String} aValue The new phone number value to set.
     * @returns {String} The set value.
     */

    return this.get('phoneInput').setValue(aValue || '');
});

//  ------------------------------------------------------------------------

APP.pizza.info.Inst.defineHandler('OrderChange',
function(aSignal) {

    /**
     * @method handleOrderChange
     * @summary Responds to changes in order information by updating the name,
     *     phone, etc. fields with their corresponding order values.
     * @param {TP.sig.Signal} aSignal The signal.
     */

    let order;

    order = aSignal.getPayload();

    this.setOrderName(order.name);
    this.setOrderPhone(order.phone);
});

//  ------------------------------------------------------------------------

APP.pizza.info.Inst.defineHandler('UpdateOrderInfo',
function(aSignal) {

    /**
     * @method handleUpdateOrderInfo
     * @summary Responds to changes in order information by augmenting the
     *     signal with name, phone, etc. and allowing it to bubble to the
     *     application controller to update the order.
     * @param {TP.sig.Signal} aSignal The signal.
     */

    //  Update payload with current data values and let it bubble. The
    //  payload will be leveraged to update the raw order higher up.
    aSignal.setPayload({
        name: this.getOrderName(),
        phone: this.getOrderPhone()
    });
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
