import { Model, Schema, model } from 'mongoose';
import ICourse, { TTag, TDetails } from './course.interface';
import moment from 'moment';

const tagSchema = new Schema<TTag>(
  {
    name: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    _id: false,
  },
);

// Many many thanks to this StackOverflow page
// https://stackoverflow.com/questions/26069640/mongo-addtoset-still-inserting-despite-item-in-array-existing
//
const detailsSchema = new Schema<TDetails>(
  {
    level: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    _id: false,
  },
);

// Throwing out virtuals
// interface ICourseVirtuals {
//   durationInWeeks: number;
// }

//type CourseModel = Model<ICourse, ICourseVirtuals>;

//const courseSchema = new Schema<ICourse, CourseModel, ICourseVirtuals>(
interface ICourseModel extends Model<ICourse> {
  isIdExists(_id: string): Promise<boolean | ICourse | null>;
}

const courseSchema = new Schema<ICourse, ICourseModel>(
  {
    title: { type: String, required: true, unique: true },
    instructor: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: { type: Number, required: true },
    tags: [tagSchema],
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    language: { type: String, required: true },
    provider: { type: String, required: true },
    durationInWeeks: { type: Number },
    details: detailsSchema,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    versionKey: false,
    timestamps: true,
    // Throwing out virtuals
    // id: false,
    // toJSON: {
    //   virtuals: true,
    // },
  },
);

courseSchema.statics.isIdExists = async function (_id: string) {
  const foundCourse = await this.findById(_id);
  if (foundCourse) {
    return true;
  } else {
    return false;
  }
};

// Pre Won't work nice
// if startDate and endDate, these
// are updated
// But If I query using	durationInWeeks
// Pre/Post hook is the way
courseSchema.pre('save', function (next) {
  const startDate = moment(this.startDate);
  const endDate = moment(this.endDate);
  const diff = endDate.diff(startDate, 'days');
  const weeks = Math.ceil(diff / 7);
  this.durationInWeeks = weeks;
  next();
});

// Virtual is not working
// If I query using durationInWeeks query
// 😔
/*
courseSchema.virtual('durationInWeeks').get(function () {
  const startDate = moment(this?.startDate);
  const endDate = moment(this?.endDate);
  const diff = endDate.diff(startDate, 'days');
  const weeks = Math.ceil(diff / 7);
  return weeks;
});
*/

const Course = model<ICourse, ICourseModel>('Course', courseSchema);

export default Course;
