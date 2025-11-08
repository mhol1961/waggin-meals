"use client";
import React, { useEffect } from 'react';

export default function GHLEmbed({ embedHtml }: { embedHtml: string }) {
  useEffect(() => {}, []);
  return <div dangerouslySetInnerHTML={{ __html: embedHtml }} />;
}

// Usage: <GHLEmbed embedHtml={`<script src=\"...\"></script><div id=\"form_ABC\"></div>`} />
