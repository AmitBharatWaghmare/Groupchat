const Sequelize = require(`sequelize`);
require("dotenv").config();
const sequelize = new Sequelize(db_name, db_Username,'@mIT1995', {
  dialect: `mysql`,
  host: 'localhost',
});
module.exports = sequelize;