import { create } from 'zustand'

interface Me {
  id?: string
  email?: string
  created_at?: Date
}

interface Profile {
  profile: Me
  setProfile: (action: Me) => void
}
export const useProfile = create<Profile>((set) => ({
  profile: {},
  setProfile: (evt: Me) =>
    set((state: { profile: Me }) => {
      return { profile: state.profile }
    }),
}))
