import React from 'react';
import { getBodyFromBackup } from '../app/lib/getBackupHtml';

export default function Glossaire() {
  const html = getBodyFromBackup('glossaire.html');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
