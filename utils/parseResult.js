// export const parseResult = (rawText) => {
//   console.log(rawText);
//   const lines = rawText.split('\n').filter((line) => line.trim() !== ''); // Remove empty lines
//   const data = {};

//   // Extract key fields
//   data.name = lines.find((line) => line.startsWith('Name:'));
//   data.gpa = lines.find((line) => line.startsWith('GPA'));
//   // data.batch = lines.find((line) => line.startsWith('Batch'))?.split('\t')[1];
//   data.remark = lines
//     .find((line) => line.startsWith('Remark:'))
//     ?.split('\t')[1];

//   // Extract grades
//   const tableStart = lines.findIndex((line) => line.startsWith('NO\t'));
//   data.grades = lines.slice(tableStart + 1).map((line) => {
//     const [no, semester, subject, ch, grade] = line.split('\t');
//     return { no, semester, subject, ch, grade };
//   });

//   return data;
// };
export const parseResult = (rawText) => {
  const lines = rawText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

  const data = {
    name: '',
    gpa: null,
    remark: '',
    finalExam: {
      title: '',
      level: '',
      date: '',
    },
    grades: [],
  };

  // Extract final exam title, level, date
  const titleIndex = lines.findIndex((line) =>
    line.toLowerCase().includes('final examination results')
  );
  if (titleIndex !== -1) {
    data.finalExam.title = lines[titleIndex];
    data.finalExam.level = lines[titleIndex + 1] || '';
    data.finalExam.date = lines[titleIndex + 2] || '';
  }

  // Extract name
  const nameIndex = lines.findIndex((line) => line.startsWith('Name:'));
  if (nameIndex !== -1 && lines[nameIndex + 1]) {
    data.name = lines[nameIndex + 1].trim();
  }

  // Extract GPA
  const gpaIndex = lines.findIndex((line) => line.startsWith('GPA:'));
  if (gpaIndex !== -1) {
    const gpaVal = lines[gpaIndex + 1] || lines[gpaIndex].split(':')[1];
    if (gpaVal && !isNaN(gpaVal)) {
      data.gpa = parseFloat(gpaVal);
    }
  }

  // Extract Remark
  const remarkIndex = lines.findIndex((line) => line.startsWith('Remark:'));
  if (remarkIndex !== -1 && lines[remarkIndex + 1]) {
    data.remark = lines[remarkIndex + 1].trim();
  }

  // Find the grades table start
  const tableStart = lines.findIndex((line) =>
    line.toLowerCase().startsWith('no')
  );
  for (let i = tableStart + 1; i <= lines.length - 5; i++) {
    const no = lines[i];
    const semester = lines[i + 1];
    const subject = lines[i + 2];
    const ch = lines[i + 3];
    const grade = lines[i + 4];

    if (!isNaN(no) && !isNaN(semester) && subject && !isNaN(ch) && grade) {
      data.grades.push({
        no: no.trim(),
        semester: semester.trim(),
        subject: subject.trim(),
        ch: ch.trim(),
        grade: grade.trim(),
      });
      i += 4;
    }
  }

  return data;
};
