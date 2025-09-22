"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout, selectCurrentUser } from "../../store/slices/authSlice"
import { useLogoutMutation } from "../../store/api/authApi"

const SessionManager = ({ children }) => {
    const dispatch = useDispatch()
    const user = useSelector(selectCurrentUser)
    const [logoutMutation] = useLogoutMutation()

    useEffect(() => {
        let sessionTimer

        const checkSession = () => {
            const authData = sessionStorage.getItem("auth")
            if (authData) {
                try {
                    const parsedAuth = JSON.parse(authData)
                    const now = new Date().getTime()

                    if (parsedAuth.sessionExpiry && now > parsedAuth.sessionExpiry) {
                        // Session expired
                        handleLogout()
                    } else {
                        // Set timer for remaining session time
                        const timeRemaining = parsedAuth.sessionExpiry - now
                        sessionTimer = setTimeout(() => {
                            handleLogout()
                        }, timeRemaining)
                    }
                } catch (error) {
                    console.error("Error parsing auth data:", error)
                    handleLogout()
                }
            }
        }

        const handleLogout = async () => {
            try {
                await logoutMutation().unwrap()
            } catch (error) {
                console.error("Logout error:", error)
            } finally {
                dispatch(logout())
            }
        }

        if (user) {
            checkSession()
        }

        return () => {
            if (sessionTimer) {
                clearTimeout(sessionTimer)
            }
        }
    }, [user, dispatch, logoutMutation])

    return children
}

export default SessionManager
