const categories = [
  {
    name: 'Competative Programming',
  },
  {
    name: 'Web Development',
  },
  {
    name: 'Digital Marketing',
  },
  {
    name: 'UI/UX Design',
  },
];

const courses = [
  {
    title: 'Sample Course || Testing',
    instructor: 'Jane Doe',
    categoryId: '123456789012345678901234',
    price: 49.99,
    tags: [
      {
        name: 'Programming',
        isDeleted: false,
      },
      {
        name: 'Web Development',
        isDeleted: false,
      },
    ],
    startDate: '2023-01-15',
    endDate: '2023-03-14',
    language: 'English',
    provider: 'Tech Academy',
    details: {
      level: 'Intermediate',
      description: 'Detailed description of the course',
    },
  },
];

const tags = categories.map((itm) => {
  const newItm = { ...itm };
  newItm['isDeleted'] = false;
  return newItm;
});

const levels = ['Beginner', 'Intermediate', 'Advanced'];

module.exports = { tags, categories, courses, levels };
