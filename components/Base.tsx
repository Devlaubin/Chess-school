import React from 'react';
import { getBodyFromBackup } from '../app/lib/getBackupHtml';

export default function Base() {
  const html = getBodyFromBackup('base.html');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
