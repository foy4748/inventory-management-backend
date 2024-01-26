import Course from '../course/course.model';
import catchAsyncError from '../../utils/catchAsyncError';
import config from '../../config';

export const CflushDb = catchAsyncError(async (req, res, _) => {
  if (req.headers.secret == config.flash_db_secret) {
    await Course.deleteMany();

    return res.send({ error: false, message: 'Flushed DB successfully' });
  } else {
    return res.send({ error: true, message: 'Secret was not provided' });
  }
});
