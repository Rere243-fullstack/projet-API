import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, beforeSave } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'


// AuthFinder = gestion login/password avec vérification du hash
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})
 // On crée une "base" propre pour notre User
const BaseModelWithAuth = compose(BaseModel, AuthFinder) as unknown as typeof BaseModel
 export default class User extends BaseModelWithAuth {
  static verifyCredentials(_email: any, _password: any) {
    throw new Error('Method not implemented.')
  }
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare email: string

  // Ne pas renvoyer le mot de passe dans les réponses JSON
  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  /**
   * Hook: hacher le mot de passe avant save/update
   */
  @beforeSave()
  static async hashPassword(user: User) : Promise<void> {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}
