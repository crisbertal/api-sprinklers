'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
class CustomValidationProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    //
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot() {
    const Validator = use('Validator');
    // Register
    Validator.extend('uniqueProductByUser', this._uniqueProductByUser);
    Validator.extend('existsID', this._existsid);
  }

  /** Validate if a person exists
  *
  * @usage personExists
  **/
  async _uniqueProductByUser(data, field, message, args, get) {
    // Same as data[ field ]. 
    const url = get(data, field);
    // Get info from DB
    const user = await use('App/Models/User').find(args[0])
    const row = await user.products().where("url", url).count();
    // If this person doesn't exists 
    if (row) {
      throw 'The user already has that product added.';
    }
  }

  /** Validate if a row personExists
  *
  * @usage personExists
  **/
  async _existsid(data, field, message, args, get) {
    const id = get(data, field);
    // Get info from DB
    const row = await use(args[0]).find(id);

    // If this person doesn't exists 
    if (!row) {
      throw 'Field ' + field + ' not exists on ' + args[0] + ' collection';
    }
  }
}

module.exports = CustomValidationProvider