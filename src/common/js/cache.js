export function loadSearch (key) {
  return JSON.parse(localStorage.getItem(key)) || false
}
