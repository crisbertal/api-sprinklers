"use strict";
const User = use("App/Models/User");
const Product = use("App/Models/Product");
const ScraperQueue = use("App/Models/ScraperQueue");
const Logger = use("App/Models/Logger");
const Coupon = use("App/Models/Coupon");
const { validateAll } = use("Validator");
const Hash = use("Hash");
const { ValidationHelper } = use("App/Helpers/GlobalHelper");
const Ws = use("Ws");
const moment = use("moment");
class AdministratorController {
  //Start Product
  async adminGetAllProduct({ request, response }) {
    return response
      .status(200)
      .json(await User.select(["id", "email"]).with("products").fetch());
  }
  async adminUpdateProduct({ request, response }) {
    const validators = {
      "user._id": "required|existsID:App/Models/User",
      "product._id": "required|existsID:App/Models/Product",
    };
    const messages = {
      "user._id.required": "User id required.",
      "product._id.required": "Product id required.",
    };
    let errores = await ValidationHelper(
      request,
      response,
      validators,
      messages
    );
    if (errores != "") {
      return await response.status(500).json({ error: errores });
    }

    const { product, user } = request.all();
    const userToUpdate = await User.find(user._id);
    const productToUpdate = await Product.find(product._id);

    await productToUpdate.merge(product);
    const scraper_queue = new ScraperQueue();
    var res;
    if (product.on_queue === true) {
      res = await scraper_queue.updateOnQueue(userToUpdate, productToUpdate);
    } else if (product.on_queue === false) {
      res = await scraper_queue.deleteOnQueue(
        userToUpdate._id.toString(),
        productToUpdate.url.toString()
      );
    }

    if ((await productToUpdate.save()) && res == true) {
      return response.status(200).json({
        error: "",
        message: "The product has been updated successfully.",
      });
    } else {
      return response.status(500).json({ error: "Error on product Update." });
    }
  }
  async adminDeleteProduct({ request, response }) {
    const validators = {
      "user._id": "required|existsID:App/Models/User",
      "product._id": "required|existsID:App/Models/Product",
    };
    const messages = {
      "user._id.required": "User id required.",
      "product._id.required": "Product id required.",
    };
    let errores = await ValidationHelper(
      request,
      response,
      validators,
      messages
    );
    if (errores != "") {
      return await response.status(500).json({ error: errores });
    }

    const { product, user } = request.all();
    const userToUpdate = await User.find(user._id);
    const productToDelete = await Product.find(product._id);

    const scraper_queue = new ScraperQueue();
    const resdeleteOnQueue = await scraper_queue.deleteOnQueue(
      userToUpdate._id,
      productToDelete.url
    );

    if ((await productToDelete.delete()) && resdeleteOnQueue == true) {
      return response.status(200).json({
        error: "",
        message: "The product has been deleted successfully.",
      });
    } else {
      return response
        .status(500)
        .json({ error: "Error trying to delete the product" });
    }
  }

  //End Product

  //Start Websocket Notificator
  async adminWebsocketNotificateAllUser({ request, response }) {
    const validators = {
      "notification.title": "required",
      "notification.body": "required",
    };
    const messages = {
      "notification.title.required": "Notification title required.",
      "notification.body.required": "Notification body required.",
    };
    let errores = await ValidationHelper(
      request,
      response,
      validators,
      messages
    );
    if (errores != "") {
      return await response.status(500).json({ error: errores });
    }
    const { notification } = request.all();
    const topic = Ws.getChannel("GeneralChannel").topic("GeneralChannel");
    // if no one is listening, so the `topic('subscriptions')` method will return `null`

    if (topic) {
      topic.broadcastToAll("message", notification);
      return await response
        .status(200)
        .json({ error: "", message: "Broadcast to all sucefully." });
    } else {
      return await response.status(500).json({ error: "No user online." });
    }
  }
  async adminWebsocketNotificateUser({ request, response }) {
    const validators = {
      "user._id": "required|existsID:App/Models/User",
      "notification.title": "required",
      "notification.body": "required",
    };
    const messages = {
      "user._id.required": "User id required.",
      "notification.title.required": "Notification title required.",
      "notification.body.required": "Notification body required.",
    };
    let errores = await ValidationHelper(
      request,
      response,
      validators,
      messages
    );
    if (errores != "") {
      return await response.status(500).json({ error: errores });
    }
    const { user } = request.all();
    const { notification } = request.all();

    const topic = Ws.getChannel("UserNotificationChannel:*").topic(
      "UserNotificationChannel:" + user._id
    );
    // if no one is listening, so the `topic('subscriptions')` method will return `null`
    if (topic) {
      topic.broadcastToAll("message", notification);
      return await response
        .status(200)
        .json({ error: "", message: "Broadcast to user sent succesfully." });
    } else {
      return await response
        .status(500)
        .json({ error: "The user is not online." });
    }
  }
  //End Websocket Notificator

  //Start ScraperQueue
  async adminGetAllScraperOnQueue({ request, response }) {
    return response.status(200).json(await ScraperQueue.fetch());
  }
  //End ScraperQueue

  //Start Logger
  async adminGetAllLogger({ request, response }) {
    return response.status(200).json(await Logger.sort("-created_at").fetch());
  }
  //End Logger

  //Start User
  async adminGetAllUser({ request, response }) {
    return response.status(200).json(await User.with("subscriptions").fetch());
  }
  async adminUpdateUser({ request, response }) {
    //START REQUEST VALIDATION
    const validation = await validateAll(
      request.all(),
      {
        "user._id": "required|existsID:App/Models/User",
      },
      {
        "user._id.required": "User id required.",
      }
    );

    if (validation.fails()) {
      let errores = "";
      validation.messages().forEach((element) => {
        errores += element.message + ",";
      });
      return response.status(500).json({ error: errores });
    }
    //END REQUEST VALIDATION
    const { user } = request.all();
    const userToUpdate = await User.find(user._id);
    userToUpdate.username = user.username || userToUpdate.username;
    userToUpdate.isActive = user.isActive || userToUpdate.isActive;
    userToUpdate.isAdmin = user.isAdmin || userToUpdate.isAdmin;
    userToUpdate.validationTries =
      user.validationTries || userToUpdate.validationTries;
    userToUpdate.email = user.email || userToUpdate.email;
    if (await userToUpdate.save()) {
      return response.status(200).json({
        error: "",
        message: "User update successfully.",
      });
    } else {
      return response
        .status(500)
        .json({ error: "Error trying to update the user information." });
    }
  }

  async adminDeleteUser({ request, response }) {
    //START REQUEST VALIDATION
    const validation = await validateAll(
      request.all(),
      { id_user: "required|existsID:App/Models/User" },
      { "id_user.required": "Id user required." }
    );

    if (validation.fails()) {
      let errores = "";
      validation.messages().forEach((element) => {
        errores += element.message + ",";
      });
      return response.status(500).json({ error: errores });
    }
    //END REQUEST VALIDATION
    const { id_user } = request.all();
    const user = await User.find(id_user);
    if (
      (await user.products().delete()) &&
      (await user.subscriptions().delete()) &&
      (await user.delete())
    ) {
      return response.status(200).json({
        error: "",
        message: "The user has been deleted successfully.",
      });
    } else {
      return response
        .status(500)
        .json({ error: "Error trying to delete the user." });
    }
  }

  //End User

  //Start Coupon
  async adminGetAllCodes({ request, response }) {
    return response.status(200).json(await Coupon.fetch());
  }
  async adminAddCode({ request, response }) {
    //START REQUEST VALIDATION
    const validation = await validateAll(
      request.all(),
      {
        code: "required|unique:coupons,code",
        num_tries: "required|integer|above:0",
        //"num_days_on_subscription": "required|integer|above:0",
        expiration_date: "required|date",
      },
      {
        "code.required": "Coupon code required.",
        "code.unique": "Coupon code in use.",
        "num_tries.required": "Coupon num_tries required.",
        "num_tries.integer": "Coupon num_tries not integer.",
        "num_tries.above": "Coupon num_tries min 1",
        /*"num_days_on_subscription.required": "Coupon num_days_on_subscription required.",
        "num_days_on_subscription.integer": "Coupon num_days_on_subscription not integer.",
        "num_days_on_subscription.above": "Coupon num_days_on_subscription min 1.",*/
        "expiration_date.required": "Coupon expiration_date required.",
        "expiration_date.date": "Coupon expiration_date not date.",
      }
    );

    if (validation.fails()) {
      let errores = "";
      validation.messages().forEach((element) => {
        errores += element.message + ",";
      });
      return response.status(500).json({ error: errores });
    }
    //END REQUEST VALIDATION

    const { code, num_tries, expiration_date } = request.all();
    let now = moment().tz("Europe/Berlin").format();

    if (expiration_date < now) {
      return response.status(500).json({
        error: "The expiration date must be greater than the current date.",
      });
    } else {
      const coupon = new Coupon();

      coupon.code = code;
      coupon.num_tries = Number(num_tries);
      coupon.expiration_date = expiration_date;

      if (await coupon.save()) {
        return response.status(200).json({
          error: "",
          message: "The coupon has been redeemed successfully.",
        });
      } else {
        return response
          .status(500)
          .json({ error: "Error trying to redeem the coupon." });
      }
    }
  }
  async adminDeleteCode({ request, response }) {
    //START REQUEST VALIDATION
    const validation = await validateAll(
      request.all(),
      {
        id_coupon: "required|existsID:App/Models/Coupon",
      },
      {
        "id_coupon.required": "Coupon code required.",
      }
    );

    if (validation.fails()) {
      let errores = "";
      validation.messages().forEach((element) => {
        errores += element.message + ",";
      });
      return response.status(500).json({ error: errores });
    }
    //END REQUEST VALIDATION

    const { id_coupon } = request.all();

    const coupon = await Coupon.find(id_coupon);
    if (await coupon.delete()) {
      return response.status(200).json({
        error: "",
        message: "Coupon delete successfully.",
      });
    } else {
      return response
        .status(500)
        .json({ error: "Error trying to delete the coupon." });
    }
  }

  async adminUpdateCode({ request, response }) {
    //START REQUEST VALIDATION
    const validation = await validateAll(
      request.all(),
      {
        id_coupon: "required|existsID:App/Models/Coupon",
        num_tries: "required|integer|above:0",
        expiration_date: "required|date",
      },
      {
        "id_coupon.required": "Coupon code required.",
        "num_tries.required": "Coupon num_tries required.",
        "num_tries.integer": "Coupon num_tries not integer.",
        "num_tries.above": "Coupon num_tries min 1",
        "expiration_date.required": "Coupon expiration_date required.",
        "expiration_date.date": "Coupon expiration_date not date.",
      }
    );

    if (validation.fails()) {
      let errores = "";
      validation.messages().forEach((element) => {
        errores += element.message + ",";
      });
      return response.status(500).json({ error: errores });
    }
    //END REQUEST VALIDATION

    const { id_coupon, num_tries, expiration_date } = request.all();

    let now = moment().tz("Europe/Berlin").format();

    if (expiration_date < now) {
      return response.status(500).json({
        error: "The expiration date must be greater than the current date.",
      });
    } else {
      const coupon = await Coupon.find(id_coupon);

      coupon.num_tries = Number(num_tries);
      coupon.expiration_date = expiration_date;

      if (await coupon.save()) {
        return response.status(200).json({
          error: "",
          message: "Coupon update successfully.",
        });
      } else {
        return response
          .status(500)
          .json({ error: "Error trying to update the coupon." });
      }
    }
  }

  //End Coupon
}

module.exports = AdministratorController;
