// Helper utilities for notifications
export function preserveOnlyAccountCreation() {
  try {
    const raw = localStorage.getItem('notifications')
    const existing = raw ? JSON.parse(raw) : []

    // Find an existing signup/account-created notification
    let signup = (existing || []).find((n: any) => n && ((n.id && String(n.id).startsWith('signup-')) || n.title === 'Account Created'))

    if (!signup) {
      // Recreate a basic account-created notification from userData if possible
      const userDataRaw = localStorage.getItem('userData')
      let displayName = 'User'
      let source = 'system'
      if (userDataRaw) {
        try {
          const ud = JSON.parse(userDataRaw)
          displayName = `${ud.firstName || ''} ${ud.lastName || ''}`.trim() || displayName
          source = ud.accountType === 'student' ? 'student' : 'system'
        } catch (e) {
          // ignore
        }
      }
  signup = { id: `signup-${Date.now()}`, title: 'Account Created', message: `Welcome ${displayName}`, time: 'Just now', timestamp: Date.now(), clickable: false, source }
    }

    const kept = [signup]
    try { localStorage.setItem('notifications', JSON.stringify(kept)) } catch (e) {}
    // notify other windows/tabs and same-window listeners
    try { window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: { key: 'notifications' } })) } catch (e) {}
    return kept
  } catch (e) {
    // On any failure, ensure we return an array
    console.error('preserveOnlyAccountCreation error', e)
    return []
  }
}
