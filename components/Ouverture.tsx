import React from 'react';
import { getBodyFromBackup } from '../app/lib/getBackupHtml';

export default function Ouverture() {
  const html = getBodyFromBackup('ouverture.html');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
