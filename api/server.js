const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");

const { UserController } = require("./controllers/UserController");
const { CompanyController } = require("./controllers/CompanyController");
const { ProductController } = require("./controllers/ProductController");
const { SellController } = require("./controllers/SellController");
const { ServiceController } = require("./controllers/ServiceController");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World! This is the backend server.");
});

//Usre
app.post("/api/user/signin", UserController.signIn);
app.get("/api/user/info", UserController.info);
app.put("/api/user/update", UserController.update);
app.get("/api/user/list", UserController.list);
app.post("/api/user/create", UserController.create);
app.put("/api/user/update/:id", UserController.updateId);
app.delete("/api/user/remove/:id", UserController.removeId);

//company
app.post("/api/company/create", CompanyController.create);
app.get("/api/company/list", CompanyController.list);

//Buy
app.post("/api/buy/create", ProductController.create);
app.get("/api/buy/list", ProductController.list);
app.put("/api/buy/update/:id", ProductController.update);
app.delete("/api/buy/remove/:id", ProductController.remove);

//Sell
app.post("/api/sell/create", SellController.create);
app.get("/api/sell/list", SellController.list);
app.delete("/api/sell/remove/:id", SellController.remove);
app.get("/api/sell/confirm", SellController.confirm);
app.get ('/api/sell/dashboard', SellController.dashboard);

//Service
app.post("/api/service/create", ServiceController.create);
app.get("/api/service/list", ServiceController.list);
app.put("/api/service/update/:id", ServiceController.update);
app.delete("/api/service/remove/:id", ServiceController.remove);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
