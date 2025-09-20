/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'API mini projet',
  }
})
const UsersController = () => import('#controllers/users_controller')

router.post('/register', [UsersController, 'register'])
router.post('/login', [UsersController, 'login'])
router.get('/profile', [UsersController, 'profile']).use(middleware.auth())
