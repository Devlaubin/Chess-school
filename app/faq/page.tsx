import React from 'react';
import { getBodyFromBackup } from '../lib/getBackupHtml';

export default function Page() {
  const html = getBodyFromBackup('faq.html');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
