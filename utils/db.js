const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/natan", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose
  .connect("mongodb://127.0.0.1:27017/natan")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection failed", err));

// //menambah 1 data:
// const contact1 = new Contact({
//   name: "yossi",
//   nohp: "087832443235",
//   nickname: "oci",
//   email: "yossi@gmail.com",
// });

// //simpan ke collections
// contact1.save().then((contact) => console.log(contact));
