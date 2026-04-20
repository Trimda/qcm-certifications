import type { Qcm } from '@/types';

const slugify = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const csvEscape = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const exportQcmJson = (qcm: Qcm): void => {
  const content = JSON.stringify(qcm, null, 2);
  const filename = `${slugify(qcm.title.fr || qcm.title.en)}.json`;
  downloadFile(content, filename, 'application/json');
};

export const exportQcmCsv = (qcm: Qcm): void => {
  const headers = ['question_fr', 'question_en', 'option_a_fr', 'option_a_en', 'option_b_fr', 'option_b_en', 'option_c_fr', 'option_c_en', 'option_d_fr', 'option_d_en', 'correct_answer'];
  const rows = qcm.questions.map(q => {
    const options = q.options.slice(0, 4);
    const optionCells: string[] = [];
    for (let i = 0; i < 4; i++) {
      optionCells.push(csvEscape(options[i]?.text.fr ?? ''));
      optionCells.push(csvEscape(options[i]?.text.en ?? ''));
    }
    const correct = Array.isArray(q.correctAnswer)
      ? q.correctAnswer.join('|')
      : q.correctAnswer;
    return [
      csvEscape(q.text.fr),
      csvEscape(q.text.en),
      ...optionCells,
      csvEscape(correct),
    ].join(',');
  });

  const content = [headers.join(','), ...rows].join('\n');
  const filename = `${slugify(qcm.title.fr || qcm.title.en)}.csv`;
  downloadFile(content, filename, 'text/csv;charset=utf-8;');
};
