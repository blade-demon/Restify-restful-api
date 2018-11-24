const errors = require("restify-errors");
const Customer = require("../models/customer");
const rjwt = require("restify-jwt-community");
const config = require("../config");

module.exports = server => {
  server.get("/customers", async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send({ customers });
      next();
    } catch (error) {
      return next(new errors.InvalidContentError(error));
    }
  });

  server.get("/customers/:id", async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.send(customer);
      next();
    } catch (error) {
      return next(
        new errors.InvalidContentError(
          `There is no customer with the id of ${req.params.id}`
        )
      );
    }
  });

  server.post(
    "/customers",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // check for json
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError("Expects 'application/json")
        );
      }

      const { name, email, balance } = req.body;

      const customer = new Customer({
        name,
        email,
        balance
      });

      try {
        const newCustomer = await customer.save();
        res.send(201);
        next();
      } catch (error) {
        return next(new errors.InvalidContentError(error));
      }
    }
  );

  // Update data
  server.patch(
    "/customers/:id",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // check for json
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError("Expects 'application/json")
        );
      }
      try {
        const customer = await Customer.findByIdAndUpdate(
          { _id: req.params.id },
          req.body
        );
        res.send(200);
        next();
      } catch (error) {
        return next(new errors.InvalidContentError(error));
      }
    }
  );

  // Delete
  server.del(
    "/customers/:id",
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const customer = await Customer.findOneAndRemove({
          _id: req.params.id
        });
        res.send(204);
        next();
      } catch (error) {
        return next(new errors.InvalidContentError(error));
      }
    }
  );
};
