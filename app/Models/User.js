'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = use('moment')
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static get hidden() {
    return ['password']
  }
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    /*this.addHook("beforeSave", async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });*/

    /*this.addHook("afterFind", async (userInstance) => {
      //Add premiun_account flag to UserModer after fetch this.
      const end_last_subscription_date = await userInstance.subscriptions().select("end_date").orderBy('created_at', 'desc').first();
      if (end_last_subscription_date) {
        userInstance.premium_account = moment().tz("Europe/Berlin").format() <= end_last_subscription_date.end_date ? true : false;
      } else {
        userInstance.premium_account = false;
      }
    });*/
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  products() {
    return this.hasMany('App/Models/Product')
  }

  subscriptions() {
    return this.hasMany('App/Models/Subscription')
  }

  productsOnQueue() {
    return this.hasMany('App/Models/ScraperQueue', '_id', 'array_users.user_id')
  }

  async countProductsOnQueue() {
    const res = await this.productsOnQueue().count()
    return res ? res : 0
  }

  async isPremiumAccount() {
    let end_last_subscription_date = await this.subscriptions()
      .select('end_date')
      .orderBy('created_at', 'desc')
      .first()
    if (end_last_subscription_date) {
      return moment().tz('Europe/Berlin').format() <=
        end_last_subscription_date.end_date
        ? end_last_subscription_date.end_date
        : false
    } else {
      return false
    }
  }
  //START VALIDATION AND MESSAGES
  static registerRules() {
    const rules = {
      email: 'required|email|unique:users,email',
      username: 'required',
      password: 'required',
    }
    return rules
  }
  static registerRulesMessages() {
    const messages = {
      'email.unique': 'Email already in use',
      'email.required': 'Email required',
      'email.email': 'Email not valid.',
      'username.required': 'Username required',
      'password.required': 'Password required',
    }
    return messages
  }

  static changePasswordRules() {
    const rules = {
      password: 'required',
    }
    return rules
  }
  static changePasswordMessages() {
    const messages = {
      'password.required': 'Password required',
    }
    return messages
  }

  //END VALIDATION AND MESSAGES
}

module.exports = User
