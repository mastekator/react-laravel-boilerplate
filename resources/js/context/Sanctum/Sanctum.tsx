import * as React from 'react'
import axios, {AxiosError} from 'axios'
import SanctumContext from './SanctumContext'
import {IUser, IWorkMode} from '../models/users'

axios.defaults.withCredentials = true

const token = localStorage.getItem('access_token')

if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

interface Props {
    config: {
        apiUrl: string
        csrfCookieRoute: string
        signInRoute: string
        signUpRoute: string
        signOutRoute: string
        forgotPasswordRoute: string
        resetPasswordRoute: string
        userObjectRoute: string
    };
    checkOnInit?: boolean
}

interface State {
    user: null | IUser | false
    authenticated: null | boolean
    workMode: null | IWorkMode
}

// const setAccessToLocale = (data) => {
//     const activeAccess = Object.entries(data.role.accesses)
//         .map(([key, value]) => {
//             if (value == 1) {
//                 return key
//             } else {
//                 return null
//             }
//         })
//         .filter((el) => el !== null)
//     localStorage.setItem(
//         'access_types', JSON.stringify(activeAccess.join(',')))
// }

class Sanctum extends React.Component<Props, State> {
    static defaultProps = {
        checkOnInit: true
    }

    constructor(props: Props) {
        super(props)

        this.state = {
            user: null,
            authenticated: null,
            workMode: null
        }

        this.signIn = this.signIn.bind(this)
        this.signUp = this.signUp.bind(this)
        this.signOut = this.signOut.bind(this)
        this.checkWorkMode = this.checkWorkMode.bind(this)
        this.forgotPassword = this.forgotPassword.bind(this)
        this.resetPassword = this.resetPassword.bind(this)
        this.setUser = this.setUser.bind(this)
        this.checkAuthentication = this.checkAuthentication.bind(this)
    }

    signIn(signInData: Record<string, never>): Promise<Record<string, never>> {
        const {apiUrl, csrfCookieRoute, signInRoute, userObjectRoute} = this.props.config

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                // Get CSRF cookie.
                await axios
                    .get(`${apiUrl}/${csrfCookieRoute}`)
                // Sign in.
                await axios
                    .post(`${apiUrl}/${signInRoute}`, signInData)
                    .then((answer) => localStorage.setItem('access_token', answer.data))
                const token = localStorage.getItem('access_token')
                // When correct, get the user data.
                const {data} = await axios
                    .get(`${apiUrl}/${userObjectRoute}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                // setAccessToLocale(data)
                this.setState({user: data, authenticated: true})
                return resolve(data)
            } catch (error) {
                return reject(error)
            }
        })
    }

    signUp(signUpData: Record<string, never>): Promise<Record<string, never>> {
        const {apiUrl, signUpRoute, userObjectRoute, csrfCookieRoute} = this.props.config
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                // Get CSRF cookie.
                await axios
                    .get(`${apiUrl}/${csrfCookieRoute}`)
                // Sign up.
                await axios
                    .post(`${apiUrl}/${signUpRoute}`, signUpData)
                    .then((answer) => localStorage.setItem('access_token', answer.data))
                const token = localStorage.getItem('access_token')
                // When correct, get the user data.
                const {data} = await axios
                    .get(`${apiUrl}/${userObjectRoute}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                this.setState({user: data, authenticated: true})
                return resolve(data)
            } catch (error) {
                return reject(error)
            }
        })
    }

    checkWorkMode(): Promise<IWorkMode> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const {data} = await axios
                    .get('/api/workmode')
                this.setState({workMode: data})
                return resolve(data)
            } catch (error) {
                this.setState({workMode: null})
                return reject(error)
            }
        })
    }

    forgotPassword(forgotPasswordData: Record<string, never>): Promise<boolean> {
        const {apiUrl, forgotPasswordRoute} = this.props.config

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                await axios
                    .post(`${apiUrl}/${forgotPasswordRoute}`, forgotPasswordData)
                return resolve(true)
            } catch (error) {
                return reject(error)
            }
        })
    }

    resetPassword(resetPasswordData: Record<string, never>): Promise<boolean> {
        const {apiUrl, resetPasswordRoute} = this.props.config

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                await axios
                    .post(`${apiUrl}/${resetPasswordRoute}`, resetPasswordData)
                return resolve(true)
            } catch (error) {
                return reject(error)
            }
        })
    }

    signOut(): Promise<boolean> {
        const {apiUrl, signOutRoute} = this.props.config
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                await axios.post(`${apiUrl}/${signOutRoute}`)
                // Only sign out after the server has successfully responded.
                this.setState({user: false, authenticated: false})
                // localStorage.removeItem('access_types')
                resolve()
            } catch (error) {
                return reject(error)
            }
        })
    }

    setUser(
        user: IUser | false | null,
        authenticated = true): void {
        this.setState({user, authenticated})
    }

    async checkAuthentication(): Promise<boolean> {
        const {apiUrl, userObjectRoute} = this.props.config
        return await axios
            .get(`${apiUrl}/${userObjectRoute}`)
            .then(({data}) => {
                // setAccessToLocale(data)
                this.setState({user: data, authenticated: true})
                return true
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.status === 401) {
                    // If there's a 401 error the user is not signed in.
                    this.setState({user: false, authenticated: false})
                    // localStorage.removeItem('access_types')
                    return false
                } else {
                    // If there's any other error, something has gone wrong.
                    return false
                }
            })
    }

    componentDidMount(): void {
        if (this.props.checkOnInit) {
            this.checkAuthentication()
        }
    }

    render(): JSX.Element {
        return (
            <SanctumContext.Provider
                value={{
                    user: this.state.user,
                    workMode: this.state.workMode,
                    authenticated: this.state.authenticated,
                    signIn: this.signIn,
                    signUp: this.signUp,
                    signOut: this.signOut,
                    forgotPassword: this.forgotPassword,
                    resetPassword: this.resetPassword,
                    setUser: this.setUser,
                    checkWorkMode: this.checkWorkMode,
                    checkAuthentication: this.checkAuthentication
                }}
            >
                {this.props.children || null}
            </SanctumContext.Provider>
        )
    }
}

export default Sanctum
