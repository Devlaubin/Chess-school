import React from 'react';
import { getBodyFromBackup } from '../app/lib/getBackupHtml';

export default function Probleme() {
  const html = getBodyFromBackup('probleme.html');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
