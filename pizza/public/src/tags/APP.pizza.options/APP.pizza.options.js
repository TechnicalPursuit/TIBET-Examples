//  ========================================================================
/**
 * @type APP.pizza.options
 * @summary Tag type which manages the pizza options portion of the UI. This tag
 * is where pizza size, toppings, etc. are selected and added to the order.
 */
//  ------------------------------------------------------------------------

TP.tag.TemplatedTag.defineSubtype('APP.pizza:options');

APP.pizza.options.defineAttribute('themeURI', TP.NO_RESULT);

//  Mix in checkbox items utility methods from the APP.pizza.items Type. NOTE
//  that we resolve the getItems method to ensure we get the one being provided
//  by the APP.pizza.items mixin rather than our inherited implementation.
APP.pizza.options.addTraits(APP.pizza.items);
APP.pizza.options.Inst.resolveTraits(TP.ac('getItems'), APP.pizza.items);

//  ------------------------------------------------------------------------
//  Inst Attributes
//  ------------------------------------------------------------------------

//  Access path to the pizza "sizes" select control.
APP.pizza.options.Inst.defineAttribute('sizeSelect',
    TP.cpc('> div[class="body"] select[name="sizes"]', TP.hc('shouldCollapse', true)));

//  ------------------------------------------------------------------------
//  Inst Methods
//  ------------------------------------------------------------------------

APP.pizza.options.Inst.defineMethod('init',
function() {

    /**
     * @method init
     * @summary Initialize new instances. Here we observe OrderChange so we can
     *     reset our values when the order is cleared etc.
     * @listens {OrderChange}
     * @returns {APP.pizza.info} The new instance.
     */

    this.callNextMethod();
    this.observe(TP.sys.getApplication(), 'OrderChange');

    return this;
});

//  ------------------------------------------------------------------------

APP.pizza.options.Inst.defineMethod('getPizzaSize',
function() {

    /**
     * @method getPizzaSize
     * @summary Returns the currently selected pizza size in the UI.
     * @returns {String} The pizza size.
     */

    return this.get('sizeSelect').getValue();
});

//  ------------------------------------------------------------------------

APP.pizza.options.Inst.defineMethod('reset',
function() {

    /**
     * @method reset
     * @summary Reset all field values to their initial defaults.
     * @returns {APP.pizza.options} The receiver.
     */

    //  NOTE: this actually invokes a TRAIT method, 'reset', we acquired from
    //  mixing the APP.pizza.items type. The callNextMethod is unlike super() in
    //  that it works to find truly "the next method in the call chain".
    this.callNextMethod();

    this.setPizzaSize(APP.pizza.pizza.get('DEFAULT_SIZE'));

    return this;
});

//  ------------------------------------------------------------------------

APP.pizza.options.Inst.defineMethod('setPizzaSize',
function(aValue) {

    /**
     * @method setPizzaSize
     * @summary Sets the value of the pizza select UI control.
     * @param {String} aValue The pizza size to set.
     * @returns {String} The newly set pizza size.
     */

    this.get('sizeSelect').setValue(aValue);

    return this.getPizzaSize();
});

//  ------------------------------------------------------------------------
//  Inst Handlers
//  ------------------------------------------------------------------------

APP.pizza.options.Inst.defineHandler('AddPizza',
function(aSignal) {

    /**
     * @method handleAddPizza
     * @summary Responds to activation of the "Add To Order" button by ensuring
     *     the order is updated with a new pizza with size, toppings, etc.
     * @param {TP.sig.Signal} aSignal The signal.
     */

    //  Update payload with current data values and let it bubble. The
    //  payload will be leveraged to update the raw order higher up.
    aSignal.setPayload({
        diameter: this.getPizzaSize(),
        toppings: this.getSelectedValues()
    });

    this.reset();
});

//  ------------------------------------------------------------------------

APP.pizza.options.Inst.defineHandler('OrderChange',
function(aSignal) {

    /**
     * @method handleOrderChange
     * @summary Responds to changes in order information by updating the
     *     selected field values. Since there can be multiple pizzas this method
     *     is currently implemented to simply clear all values.
     * @param {TP.sig.Signal} aSignal The signal.
     */

    this.reset();
});

//  ------------------------------------------------------------------------
//  end
//  ========================================================================
