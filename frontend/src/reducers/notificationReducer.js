import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: null,
    reducers: {
        displayNotifcation(state, action)  {
            return action.payload
        },
        removeNotification(state, action) {
            return null
        }
  }
})

export const setNotification = (message, type, timeout = 3) => {
    return async dispatch => {
        dispatch(displayNotifcation({ message: message, type: type }))
        setTimeout(() => {
            dispatch(removeNotification())
          }, timeout * 1000)
    }
}

export const { displayNotifcation, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer