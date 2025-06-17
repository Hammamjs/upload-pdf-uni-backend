const studentInfo = (student) => {
  return {
    name: student.name,
    email: student.email,
    studentIdx: student.studentIdx,
    semester: student.semester,
    id: student._id,
    role: student.role,
    department: student.department,
    year: student.year,
  };
};

export default studentInfo;
