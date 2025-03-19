require('dotenv').config()

import app from './app'

app.listen(3001, () => console.log('🚀 Server Online at port 3001'))