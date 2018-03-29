import {loadSearch} from 'common/js/cache'

const state = {
  user: loadSearch('user'),
  token: loadSearch('token')
}
export default state
