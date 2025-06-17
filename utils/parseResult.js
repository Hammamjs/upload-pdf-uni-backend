export const parseResult = (rawText) => {
  const lines = rawText.split('\n').filter((line) => line.trim() !== ''); // Remove empty lines
  const data = {};

  // Extract key fields
  data.name = lines.find((line) => line.startsWith('Name:'))?.split('\t')[1];
  data.gpa = lines.find((line) => line.startsWith('GPA:'))?.split('\t')[1];

  // Extract grades
  const tableStart = lines.findIndex((line) => line.startsWith('NO\t'));
  data.grades = lines.slice(tableStart + 1).map((line) => {
    const [no, semester, subject, ch, grade] = line.split('\t');
    return { no, semester, subject, ch, grade };
  });

  return data;
};
