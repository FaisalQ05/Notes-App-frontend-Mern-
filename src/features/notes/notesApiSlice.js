import { createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'


const notesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 :
    a.completed ? 1 : -1
})

const initialState = notesAdapter.getInitialState();

const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getNotes: builder.query({
            query: () => ({
                url: '/note',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                }
            }),
            keepUnusedDataFor: 5,
            transformResponse: res => {
                const loadedNotes = res.map(note => {
                    note.id = note._id
                    return note
                })
                return notesAdapter.setAll(initialState, loadedNotes)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    const tags = [
                        { type: 'Note', id: 'LIST' },
                        ...result?.ids.map(id => ({ type: 'Note', id }))
                    ]
                    return tags
                }
                else return [{ type: 'Note', id: 'LIST' }]
            }
        }),
        addNote: builder.mutation({
            query: (initialData) => ({
                url: '/note',
                method: 'POST',
                body: {
                    ...initialData
                }
            }),
            invalidatesTags: [{ type: 'Note', id: 'LIST' }]
        }),
        updateNote: builder.mutation({
            query: (initialData) => ({
                url: '/note',
                method: 'PATCH',
                body: {
                    ...initialData
                }
            }),
            invalidatesTags: (result, error, arg) => {
                return [{ type: 'Note', id: arg.id }]
            }
        }),
        deleteNote: builder.mutation({
            query: ({ id }) => ({
                url: '/note',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => {
                return [{ type: 'Note', id: arg.id }]
            }
        })
    })
})


export const {
    useGetNotesQuery,
    useAddNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation } = notesApiSlice