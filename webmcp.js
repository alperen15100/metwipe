/* MetWipe progressive WebMCP integration. Unsupported browsers ignore this file. */
(async () => {
  const mc = document.modelContext || navigator.modelContext;
  if (!mc || typeof mc.registerTool !== 'function') return;

  const register = (tool) => Promise.resolve(mc.registerTool(tool)).catch(() => {});

  await register({
    name: 'metwipe_describe_capabilities',
    description: 'Describe MetWipe supported local metadata inspection and cleaning capabilities. No file is uploaded by this tool.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => JSON.stringify({
      processing: 'local-browser',
      formats: ['JPEG', 'PNG', 'WebP', 'MP3', 'WAV', 'DOCX', 'XLSX', 'PPTX'],
      note: 'Support varies by format; MetWipe does not claim universal removal of proprietary or exotic metadata.'
    })
  });

  await register({
    name: 'metwipe_open_file_picker',
    description: 'Open the MetWipe local file picker so the user can choose a supported file for metadata inspection. User interaction is required and the file remains in the browser.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: false },
    execute: async () => {
      const el = document.getElementById('file');
      if (!el) return 'File picker is unavailable on this page.';
      el.click();
      return 'File picker opened. The user must choose a file before scanning.';
    }
  });

  await register({
    name: 'metwipe_scan_selected_file',
    description: 'Scan the file already selected by the user with MetWipe using the existing local browser scanner. This does not upload the file to a MetWipe application server.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => {
      const el = document.getElementById('file');
      if (!el || !el.files || !el.files[0]) return 'No file selected. Ask the user to choose a supported file first.';
      if (typeof start !== 'function') return 'Scanner is not ready.';
      await start(el.files[0]);
      return 'Local metadata scan started for the user-selected file.';
    }
  });

  await register({
    name: 'metwipe_clean_selected_file',
    description: 'Run the existing MetWipe cleaner for the currently selected and scanned file. Cleaning follows the format-specific local workflow and creates a cleaned copy.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: false },
    execute: async () => {
      const btn = document.getElementById('clean');
      if (!btn || btn.disabled) return 'No cleanable scanned file is ready.';
      btn.click();
      return 'Local cleaning workflow started. The user remains in control of the generated cleaned copy.';
    }
  });
})();
