/* eslint-disable @typescript-eslint/no-explicit-any */
import ICourse, { ICoursesResult, TTag } from './course.interface';
import Course from './course.model';
import {
  defaultLimit,
  defaultPage,
  filterableFields,
  sortableFields,
} from './course.constant';
import moment from 'moment';
import AppError from '../../error/AppError';

// Create a New Course
export const ScreateCourse = async (payload: ICourse) => {
  const response = await Course.create(payload);
  return response;
};

// Get Courses
export const SgetCourses = async (
  query: Record<string, any>,
): Promise<ICoursesResult> => {
  const { sortBy, sortOrder } = query;
  const sortRule: any = {};
  const filterRule: any = {};
  const paginationRule: any = {
    page: defaultPage,
    limit: defaultLimit,
  };
  // Creating filter Rules
  filterableFields.forEach((field) => {
    if (field in query) {
      if (field == 'tags') {
        filterRule['tags.name'] = query[field];
        return;
      }
      if (field == 'level') {
        filterRule['details.level'] = query[field];
        return;
      }

      // For Ranged Date
      if (field == 'startDate') {
        filterRule[field] = { $gte: query[field] };
        return;
      }

      if (field == 'endDate') {
        filterRule[field] = { $lte: query[field] };
        return;
      }

      // Gotta fix this ============================VVVVV
      /*
      // For Ranged Price
      if (field == 'minPrice') {
        filterRule['price'] = { $gte: query[field] };
        return;
      }

      if (field == 'maxPrice') {
        filterRule['price'] = { $lte: query[field] };
        return;
      }
	  */
      // Gotta fix this ============================AAAAA

      // For Pagination
      if (field == 'page') {
        paginationRule[field] = Number(query[field]);
        return;
      }
      // For Pagination
      if (field == 'limit') {
        paginationRule[field] = Number(query[field]);
        return;
      }
      filterRule[field] = query[field];
    }
  });
  // ===================================================

  if ('minPrice' in query && 'maxPrice' in query) {
    filterRule['price'] = {
      $gte: Number(query['minPrice']),
      $lte: Number(query['maxPrice']),
    };
  }

  if (sortBy && sortableFields.includes(sortBy)) {
    sortRule[sortBy] = (sortOrder == 'desc' && -1) || 1;
  }

  const { page, limit } = paginationRule;
  const response = await Course.find(filterRule)
    .sort(sortRule)
    .populate('createdBy')
    .skip((page - 1) * limit)
    .limit(limit);

  paginationRule['total'] = await Course.find(filterRule).countDocuments();

  return {
    meta: paginationRule,
    data: response,
  };
};

export const SupdateCourse = async (courseId: string, query: any) => {
  const isPresent = await Course.isIdExists(courseId);
  if (!isPresent) {
    throw new AppError(404, `Course by provided Id ${courseId} is not found`);
  }

  const { tags, details, ...primitiveFieldsObj } = query;
  if (details) {
    for (const key in details) {
      const field = `details.${key}` as string;
      primitiveFieldsObj[field] = details[key];
    }
  }
  let isDeletedFalse = [];
  let isDeletedTrue = [];
  if (tags) {
    isDeletedFalse = tags.filter((itm: TTag) => !itm.isDeleted);
    isDeletedTrue = tags.reduce((acc: TTag[], itm: TTag) => {
      if (itm.isDeleted) {
        delete itm['isDeleted'];
        acc.push(itm);
        return acc;
      }
      return acc;
    }, []);
  }
  await Course.findByIdAndUpdate(courseId, {
    $set: primitiveFieldsObj,
    $addToSet: { tags: { $each: isDeletedFalse } },
  });
  const updatedDoc = await Course.findByIdAndUpdate(courseId, {
    $pullAll: { tags: isDeletedTrue },
  });

  // Calculating durationInWeeks
  const startDate = moment(updatedDoc?.toObject()?.startDate);
  const endDate = moment(updatedDoc?.toObject()?.endDate);
  const diff = endDate.diff(startDate, 'days');
  const weeks = Math.ceil(diff / 7);

  const updatedDurationInWeeks = await Course.findByIdAndUpdate(
    courseId,
    {
      $set: {
        durationInWeeks: weeks,
      },
    },
    { new: true },
  )
    .then((t) => t && t.populate('createdBy'))
    .then((t) => t && t);
  return updatedDurationInWeeks;
};
