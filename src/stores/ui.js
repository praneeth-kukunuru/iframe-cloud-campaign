import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const PANEL_SIZES = {
  collapsed: 60,
  expanded: 280
}

const useStore = create(
  devtools(
    persist(
      () => ({
        isPanelOpen: true
      }),
      {
        name: 'ui-store',
        version: 1,
        partialize: state => ({
          isPanelOpen: state.isPanelOpen
        })
      }
    )
  )
)

const actions = {
  setIsPanelOpen: (isPanelOpen) => {
    useStore.setState({ isPanelOpen })
  }
}

export const useUIActions = () => actions
export const useIsPanelOpen = () => useStore(state => state.isPanelOpen)

export default useStore 