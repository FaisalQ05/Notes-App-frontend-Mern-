import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from '@reduxjs/toolkit'


const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState();

const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => ({
                url: '/user',
            }),
            keepUnusedDataFor: 5,
            transformResponse: res => {
                const loadedUsers = res.map(user => {
                    user.id = user._id
                    return user
                });
                // console.log("Response Loaded : ", loadedUsers)
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    let tags = [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                    // console.log("Tags Provided : ", tags)
                    return tags;
                }
                else {
                    return [{ type: 'User', id: 'LIST' }]
                }
            }
        }),
        addUser: builder.mutation({
            query: initialUserData => ({
                url: '/user',
                validateStatus: (response, result) => {
                    // return false
                    return response.status === 200 && !result.isError
                },
                method: 'POST',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }]
        }),
        updateUser: builder.mutation({
            query: (initialData) => ({
                url: '/user',
                method: 'PATCH',
                body: {
                    ...initialData
                },
                validateStatus: (response, result) => {
                    // return false
                    return response.status === 200 && !result.isError
                }
            }),
            invalidatesTags: (result, error, arg) => {
                if (result) { return [{ type: 'User', id: arg.id }] }
                return null
            }
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/user',
                method: 'DELETE',
                body: {
                    id
                }
            }),
            invalidatesTags: (result, error, arg) => {
                return [{ type: 'User', id: arg.id }]
            }
        })
    })
})


export const {
    useGetUsersQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation } = usersApiSlice