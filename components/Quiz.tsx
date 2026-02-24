import React from 'react';
import { getBodyFromBackup } from '../app/lib/getBackupHtml';

export default function Quiz() {
  const html = getBodyFromBackup('quiz.html');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
