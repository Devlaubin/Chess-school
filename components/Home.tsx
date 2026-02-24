import React from 'react';
import { getBodyFromBackup } from '../app/lib/getBackupHtml';

export default function Home() {
  const html = getBodyFromBackup('index.html');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
