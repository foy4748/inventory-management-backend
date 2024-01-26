import { Types } from 'mongoose';
import IUser from '../user/user.interface';
//import IReview from '../review/review.interface';
export type TTag = {
  name: string;
  isDeleted?: boolean;
};

export type TDetails = {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
};

export type TQuery = {
  page?: number | `${number}`;
  limit?: number | `${number}`;
  sortBy?:
    | 'title'
    | 'price'
    | 'startDate'
    | 'endDate'
    | 'language'
    | 'duration';
  sortOrder?: 'asc' | 'desc';
  minPrice?: number | `${number}`;
  maxPrice?: number | `${number}`;
  tags?: string;
  startDate?: string;
  endDate?: string;
  language?: string;
  provider?: string;
  durationInWeeks?: number | `${number}`;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
};

interface ICourse {
  _id?: Types.ObjectId;
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: TTag[];
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks?: number;
  details: TDetails;
  createdBy: Types.ObjectId;
}

export interface ICourseUpdate {
  title?: string;
  instructor?: string;
  categoryId?: Types.ObjectId;
  price?: number;
  tags?: TTag[];
  startDate?: string;
  endDate?: string;
  language?: string;
  provider?: string;
  durationInWeeks?: number;
  'details.level': string;
  'details.description': string;
}
export interface ICoursesResult {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: ICourse[];
}

export default ICourse;
