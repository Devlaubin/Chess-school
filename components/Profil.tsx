import React from 'react';
import { getBodyFromBackup } from '../app/lib/getBackupHtml';

export default function Profil() {
  const html = getBodyFromBackup('profil.html');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
