import { apiSlice } from '../../app/api/apiSlice'
import { logOut, setCredentials } from './authSlice'

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        sendLogin: builder.mutation({
            query: (credentials) => ({
                url: '/auth',
                method: 'POST',
                body: {
                    ...credentials
                }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(logOut())
                    dispatch(apiSlice.util.resetApiState())
                }
                catch (e) {
                    // console.log("Error logout : ", e)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                console.log("******************** refresh mutation")
                try {
                    const { data } = await queryFulfilled
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                }
                catch (e) {
                    // console.log(e)
                }
            }
        })
    })
})

export const {
    useSendLoginMutation, useSendLogoutMutation, useRefreshMutation
} = authApiSlice