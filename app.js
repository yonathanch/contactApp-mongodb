const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");

require("./utils/db");
const Contact = require("./model/contact");

const app = express();
const port = 3000;

//setup method ovveride
app.use(methodOverride("_method"));

//set up ejs
app.listen(port, () => {
  console.log(`ContactApp Mongo | listening at http://localhost: ${port}`);
});

//gunakan ejs
app.set("view engine", "ejs");

//build-in middleware
app.use(express.static("public"));

//third party middleware
app.use(expressLayouts);

//
app.use(express.urlencoded({ extended: true }));

//konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

//halaman home
app.get("/", (req, res) => {
  // mengrim nilai array ke index html
  const mahasiswa = [
    {
      nama: "Yonathanch",
      email: "yonathan@gmail.com",
    },
    {
      nama: "erik",
      email: "erik@gmail.com",
    },
    {
      nama: "yossi",
      email: "yossi@gmail.com",
    },
  ];

  // cara mengirim nilai object ke html
  res.render("index", {
    nama: "YonathanChristianto",
    title: "ViewEngine",
    mahasiswa,
    layout: "layouts/main-layout",
  });
});

//halaman about
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "About Page",
  });
});

//halaman contact
app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();

  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Contact Page",
    contacts,
    msg: req.flash("msg"),
  });
});

//halaman form tambah data contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "form to add contact data",
    layout: "layouts/main-layout",
  });
});

// proses tambah data contact
app.post(
  "/contact",
  [
    body("name").custom(async (value) => {
      const duplicate = await Contact.findOne({ name: value });
      if (duplicate) {
        throw new Error("contact name is already in use!");
      }
      return true;
    }),
    check("email", "Email not valid").isEmail(),
    check("nohp", "Number Phone not valid").isMobilePhone("id-ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("add-contact", {
        title: "Form to add contact data",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    }

    try {
      await Contact.insertMany([req.body]);
      req.flash("msg", "Contact data added successfully");
      res.redirect("/contact");
    } catch (error) {
      console.error("Error inserting contact:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.delete("/contact", (req, res) => {
  Contact.deleteOne({ name: req.body.name }).then((result) => {
    req.flash("msg", "Contact data delete successfully");
    res.redirect("/contact");
  });
});

//halaman form edit data contact
app.get("/contact/edit/:name", async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });

  res.render("edit-contact", {
    title: "form to edit contact data",
    layout: "layouts/main-layout",
    contact,
  });
});

//proses ubah data
app.put(
  "/contact",
  [
    body("name").custom(async (value, { req }) => {
      const duplicate = await Contact.findOne({ name: value });
      if (value !== req.body.oldName && duplicate) {
        throw new Error("contact name is already in use!");
      }
      return true;
    }),
    check("email", "Email not valid").isEmail(),
    check("nohp", "Number Phone not valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "form to edit contact data",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            nohp: req.body.nohp,
            nickname: req.body.nickname,
            email: req.body.email,
          },
        }
      ).then((result) => {
        //kirimkan message flash
        req.flash("msg", "Contact data update successfully");
        res.redirect("/contact");
      });
    }
  }
);

//halaman detail kontak
app.get("/contact/:name", async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });

  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Contact Detail",
    contact,
  });
});
