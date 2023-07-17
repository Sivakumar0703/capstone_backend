const mongoose = require("mongoose");

const databaseName = process.env.DB_NAME

mongoose.connect( `mongodb+srv://SivaKumar:siVaAtlas@sivakumar.yhfef3z.mongodb.net/${databaseName}?retryWrites=true&w=majority`,
{useNewUrlParser:true , useUnifiedTopology:true}
);