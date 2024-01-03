import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        addBlog(state, action) {
            return [...state, action.payload]
        },
        updateBlog(state, action) {
            const storedBlogs = state.map(blog => blog.id === action.payload.id ? action.payload : blog).sort((a, b) => b.likes - a.likes)
            return storedBlogs
        },
        deleteBlog(state, action) {
            return state.filter(blog => blog.id !== action.payload)
        },
        addComment(state, action) {
            return state.map(blog => blog.id === action.payload.id ? action.payload : blog)
        },
        setBlogs(state, action) {
            const sortedBlogs = action.payload.sort((a, b) => b.likes - a.likes);
            return sortedBlogs;
        },
    }
})

export const { addBlog, updateBlog, deleteBlog, addComment, setBlogs } = blogSlice.actions
export default blogSlice.reducer