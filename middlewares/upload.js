const multer = require("multer");

const upload= multer({
  storage:multer-multer.memoryStorage(),
  limits:{fieldSize:1024*1024*50}
})

module.exports=upload