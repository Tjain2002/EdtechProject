import {combineReducers} from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice"
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice"
import courseReducer from "../slices/courseSlice"
import viewreducer from '../slices/viewCourseSlice'

const rootReducer  = combineReducers({
    auth: authReducer,
    profile:profileReducer,
    cart:cartReducer,
    course:courseReducer,
    // CourseSectionData:CourseSectionData,
    viewCourse:viewreducer,

})

export default rootReducer