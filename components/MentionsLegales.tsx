import React from 'react';
import { getBodyFromBackup } from '../app/lib/getBackupHtml';

export default function MentionsLegales() {
  const html = getBodyFromBackup('mentions-legales.html');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
