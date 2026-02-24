import React from 'react';
import { getBodyFromBackup } from '../app/lib/getBackupHtml';

export default function Videos() {
  const html = getBodyFromBackup('videos.html');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
