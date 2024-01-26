/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import catchAsyncError from '../../utils/catchAsyncError';
import sendResponse, { TResponse } from '../../utils/sendResponse';
import ICourse, { ICourseUpdate, TQuery } from './course.interface';
import { ScreateCourse, SgetCourses, SupdateCourse } from './course.service';

export const CcourseCreate = catchAsyncError(async (req, res, _) => {
  const { body, decoded } = req;

  body.createdBy = decoded._id;
  const data: ICourse = await ScreateCourse(body);
  const responseObj: TResponse<ICourse> = {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Course created successfully',
    data,
  };
  sendResponse<ICourse>(res, responseObj);
});

export const CgetCourses = catchAsyncError(async (req, res, _) => {
  const { query }: { query: TQuery } = req;
  const { data, meta } = await SgetCourses(query);
  const responseObj: TResponse<ICourse[]> = {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Courses retrieved successfully',
    meta,
    data,
  };
  sendResponse<ICourse[]>(res, responseObj);
});

export const CupdateCourse = catchAsyncError(async (req, res, _) => {
  const { courseId } = req.params;
  const query: Partial<ICourseUpdate> = req.body;
  const data = await SupdateCourse(String(courseId), query);
  const responseObj: TResponse<ICourse> = {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course updated successfully',
    data: data as ICourse,
  };
  sendResponse<ICourse>(res, responseObj);
});
