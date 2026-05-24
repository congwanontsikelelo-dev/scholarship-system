export const userKey = (email: string, key: string) => `user:${(email || '').toLowerCase()}:${key}`

export const getUserItem = (email: string | null | undefined, key: string) => {
  if (!email) return null
  try {
    return localStorage.getItem(userKey(email, key))
  } catch (e) {
    console.error('getUserItem error', e)
    return null
  }
}

export const setUserItem = (email: string | null | undefined, key: string, value: string) => {
  if (!email) return
  try {
    localStorage.setItem(userKey(email, key), value)
  } catch (e) {
    console.error('setUserItem error', e)
  }
}

export const removeUserItem = (email: string | null | undefined, key: string) => {
  if (!email) return
  try { localStorage.removeItem(userKey(email, key)) } catch (e) { console.error('removeUserItem error', e) }
}

// Copy global keys into the user's namespace (used at signup to preserve current state per user)
export const copyGlobalToUser = (email: string | null | undefined, keys: string[]) => {
  if (!email) return
  try {
    keys.forEach(k => {
      const val = localStorage.getItem(k)
      if (val !== null) localStorage.setItem(userKey(email, k), val)
    })
  } catch (e) { console.error('copyGlobalToUser error', e) }
}

// Copy user's namespaced data back to global keys (used at signin for compatibility)
export const restoreUserToGlobal = (email: string | null | undefined, keys: string[]) => {
  if (!email) return
  try {
    keys.forEach(k => {
      const val = localStorage.getItem(userKey(email, k))
      if (val !== null) localStorage.setItem(k, val)
    })
  } catch (e) { console.error('restoreUserToGlobal error', e) }
}
