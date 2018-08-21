const { main } = require('./main')

main()
  .then(x => console.log(x))
  .catch(e => console.log(e))
