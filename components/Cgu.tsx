import React from 'react';
import { getBodyFromBackup } from '../app/lib/getBackupHtml';

export default function Cgu() {
  const html = getBodyFromBackup('cgu.html');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
