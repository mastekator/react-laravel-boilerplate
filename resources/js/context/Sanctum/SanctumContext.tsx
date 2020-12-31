import * as React from 'react'
import {IUser, IWorkMode} from '../models/users'

export interface ContextProps {
    user: IUser | null | false
    authenticated: null | boolean
    workMode: IWorkMode | null
    signIn: (signInData: Record<string, never>) => Promise<Record<string, never>>
    signUp: (signUpData: Record<string, never>) => Promise<Record<string, never>>
    forgotPassword: (signUpData: Record<string, never>) => Promise<boolean>
    resetPassword: (signUpData: Record<string, never>) => Promise<boolean>
    signOut: () => void
    setUser: (user: IUser | null | false, authenticated?: boolean) => void
    checkAuthentication: () => Promise<boolean>
    checkWorkMode: () => Promise<IWorkMode>
}

const SanctumContext = React.createContext<Partial<ContextProps>>({})

export default SanctumContext
