import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  /**
   * Inscription
   */
  public async register({ request, response }: HttpContext) {
    const data = request.only(['name', 'email', 'password'])

    // Vérifie si email déjà utilisé
    const existing = await User.findBy('email', data.email)
    if (existing) {
      return response.conflict({ message: 'Cet email est déjà utilisé' })
    }

    // Crée un nouvel utilisateur
    const user = await User.create(data)

    return response.created({
      message: 'Utilisateur créé avec succès',
      user,
    })
  }

  /**
   * Connexion (avec AuthFinder)
   */
  public async login({ auth, request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Vérification directe grâce à withAuthFinder
      
      const user = User.verifyCredentials(email, password) as unknown as User
       // Génération du token API
      const token = await auth.use('api').createToken(user)

      return response.ok({ message: 'Connexion réussie', token, user })
      
    } catch {
      return response.unauthorized({ message: 'Email ou mot de passe invalide' })
    }
  }

  /**
   * Profil de l'utilisateur connecté
   */
  public async profile({ auth, response }: HttpContext) {
    await auth.check()
    return response.ok(auth.user)
  }
}
