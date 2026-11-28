const ruleVersion = 'synthetic-document-integrity/1';
const exampleDocument = 'NigeriaStack synthetic reference document.';
const maximumPayloadLength = 8192;

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function examplePayload() {
  return { document: exampleDocument, sha256: await sha256(exampleDocument) };
}

export async function checkPayload(text) {
  if (text.length > maximumPayloadLength) return { error: 'Use a payload under 8,192 characters.' };
  let input;
  try {
    input = JSON.parse(text);
  } catch {
    return { error: 'Enter valid JSON or load the example.' };
  }
  const valid = input && typeof input.document === 'string' && input.document.length > 0
    && typeof input.sha256 === 'string' && /^[a-f0-9]{64}$/i.test(input.sha256)
    && Object.keys(input).length === 2;
  if (!valid) {
    return { error: 'Provide a document string and a 64-character hexadecimal SHA-256 digest.' };
  }
  const calculated = await sha256(input.document);
  return {
    check: ruleVersion,
    environment: 'browser',
    intendedInput: 'synthetic',
    result: calculated === input.sha256.toLowerCase() ? 'pass' : 'fail',
    checks: {
      payloadShape: 'pass',
      sha256Digest: calculated === input.sha256.toLowerCase() ? 'pass' : 'fail'
    }
  };
}

function connectVerifier(form) {
  const input = form.querySelector('textarea');
  const status = form.querySelector('[data-status]');
  const example = form.querySelector('[data-example]');
  const download = form.querySelector('[data-receipt]');
  let receipt;
  let runNumber = 0;

  function clear() {
    receipt = undefined;
    download.hidden = true;
    status.textContent = '';
    return ++runNumber;
  }

  input.addEventListener('input', clear);
  example.addEventListener('click', async () => {
    const current = clear();
    try {
      const fixture = await examplePayload();
      if (current !== runNumber) return;
      input.value = JSON.stringify(fixture, null, 2);
      status.textContent = 'Example loaded. Run the check to see the result.';
    } catch {
      if (current === runNumber) status.textContent = 'This browser could not calculate the example digest.';
    }
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const current = clear();
    try {
      const result = await checkPayload(input.value);
      if (current !== runNumber) return;
      if (result.error) {
        status.textContent = result.error;
        return;
      }
      receipt = result;
      status.textContent = result.result === 'pass'
        ? 'Check passed. The document matches the supplied digest.'
        : 'Check failed. The document differs from the supplied digest.';
      download.hidden = false;
    } catch {
      if (current === runNumber) status.textContent = 'This browser could not calculate the digest.';
    }
  });
  download.addEventListener('click', () => {
    if (!receipt) return;
    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nigeriastack-conformance-receipt.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('#local-verifier');
  if (form) connectVerifier(form);
}
