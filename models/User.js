const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");

const validRoles = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} non é un Ruolo valido"
};

const userSchema = new Schema({
  name: { type: String, required: [true, "Il nome è obbligatorio"] },
  email: {
    type: String,
    unique: true,
    required: [true, "L'email è obbligatorio"]
  },
  password: { type: String, required: [true, "La password è obbligatoria"] },
  img: { type: String },
  role: { type: String, required: true, default: "USER_ROLE", enum: validRoles }
});

userSchema.plugin(uniqueValidator, {
  message: "Questa {PATH} è giá registrata"
});

module.exports = mongoose.model("User", userSchema);
