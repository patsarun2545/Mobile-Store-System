const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  ProductController: {
    create: async (req, res) => {
      try {
        const qty = req.body.qty;
        if (qty > 10000) {
          res.status(400).json({ error: "Quantity exceeds limit" });
          return;
        }
        for (let i = 0; i < qty; i++) {
          await prisma.product.create({
            data: {
              serial: req.body.serial,
              name: req.body.name,
              release: req.body.release,
              color: req.body.color,
              price: req.body.price,
              customerName: req.body.customerName,
              customerPhone: req.body.customerPhone,
              customerAddress: req.body.customerAddress,
              remark: req.body.remark ?? "",
            },
          });
        }
        res.json({ message: "Product created successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
    list: async (req, res) => {
      try {
        const products = await prisma.product.findMany({
          orderBy: { id: "desc" },
          where: {
            status: {
              not: "delete",
            },
          },
        });
        res.json(products);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
    update: async (req, res) => {
      try {
        await prisma.product.update({
          where: { id: req.params.id },
          data: {
            serial: req.body.serial,
            name: req.body.name,
            release: req.body.release,
            color: req.body.color,
            price: req.body.price,
            customerName: req.body.customerName,
            customerPhone: req.body.customerPhone,
            customerAddress: req.body.customerAddress,
            remark: req.body.remark ?? "",
          },
        });
        res.json({ message: "Product updated successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
    remove: async (req, res) => {
      try {
        await prisma.product.update({
          where: { id: req.params.id },
          data: { status: "delete" },
        });
        res.json({ message: "Product deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  },
};
