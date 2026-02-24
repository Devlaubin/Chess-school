import React from 'react';
import { getBodyFromBackup } from '../app/lib/getBackupHtml';

export default function Specificite() {
  const html = getBodyFromBackup('specificite.html');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
