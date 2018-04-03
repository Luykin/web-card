import {loadSearch} from 'common/js/cache'

const state = {
  user: loadSearch('user'),
  token: loadSearch('token'),
  scorerate: loadSearch('scorerate')
}
export default state
