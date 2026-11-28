const collectionIndexes = new Set(['industries', 'specifications', 'guides', 'municipal', 'atlas', 'states', 'councils']);
const returnPaths = new Set([
  '/', '/search', '/sectors', '/protocols', '/protocols/lga-governance-stack',
  '/rfcs', '/atlas', '/atlas/states', '/atlas/lga-774', '/governance'
]);
const collectionFields = [
  'q', 'id', 'sector', 'gap', 'maturity', 'status', 'track',
  'jurisdiction', 'scope', 'topic', 'sort'
];
const facetFields = ['sector', 'gap', 'maturity', 'status', 'track', 'jurisdiction'];
const returnParams = new Set([...collectionFields, 'page', 'wg']);
const draftFields = {
  group: 'Working Group', task: 'Type of contribution', rfc: 'Specification', revision: 'Revision',
  problem: 'Problem', affected: 'People or systems affected', binding: 'Current requirement or source',
  expected: 'Expected behavior', example: 'Synthetic example', disclosure: 'Relevant disclosure'
};
const pageSize = 12;
const maximumQueryLength = 120;
const maximumReturnLength = 768;
const collator = new Intl.Collator('en-NG', { numeric: true, sensitivity: 'base' });
const pendingIndexes = new Map();

function normalize(value) {
  return String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').trim().toLowerCase();
}

function values(value) {
  return Array.isArray(value) ? value : [value];
}

function fieldMatches(value, selected) {
  return !selected || values(value).some(item => normalize(item) === normalize(selected));
}

function compareRecords(first, second, field) {
  return collator.compare(first[field] || first.title, second[field] || second.title)
    || collator.compare(first.title, second.title)
    || collator.compare(first.url, second.url);
}

function belongsToCollection(record, kind, scope) {
  switch (kind) {
  case 'all':
    return !scope || record.kind === scope;
  case 'atlas':
    return scope ? record.kind === scope : record.kind === 'councils' || record.kind === 'states';
  case 'guides':
    return scope ? record.kind === scope : record.kind === 'guides' || record.kind === 'municipal';
  default:
    return record.kind === kind && (!scope || record.scope === scope);
  }
}

function searchScore(record, query, words) {
  const id = normalize(record.id);
  const title = normalize(record.title);
  const aliases = (record.aliases ?? []).map(normalize);
  const topics = values(record.topics ?? record.topic).map(normalize);
  const fields = [id, title, ...aliases, ...topics, ...(record.headings ?? []).map(normalize)];
  if (id === query) return 5;
  if (title === query || aliases.includes(query)) return 4;
  if (title.includes(query) || aliases.some(alias => alias.includes(query))) return 3;
  return words.every(word => fields.some(field => field.includes(word))) ? 1 : 0;
}

export function filterCollection(records, kind, state) {
  const query = normalize(state.q);
  const words = query.split(/\s+/u);
  const candidates = records.filter(record => belongsToCollection(record, kind, state.scope));
  const id = normalize(state.id) || (query && candidates.some(record => normalize(record.id) === query) ? query : '');
  const scored = [];
  for (const record of candidates) {
    if (id && normalize(record.id) !== id) continue;
    if (!facetFields.every(name => fieldMatches(record[name], state[name]))) continue;
    if (!fieldMatches(record.topics ?? record.topic, state.topic)) continue;
    const score = query ? searchScore(record, query, words) : 1;
    if (score) scored.push({ record, score });
  }
  const order = state.sort || 'relevance';
  const field = order.startsWith('id') ? 'id' : 'title';
  const direction = order.endsWith('-desc') ? -1 : 1;
  scored.sort((a, b) => {
    if (order === 'relevance' && a.score !== b.score) return b.score - a.score;
    return direction * compareRecords(a.record, b.record, field);
  });
  return scored.map(item => item.record);
}

function getIndex(kind, scope) {
  const collection = kind === 'atlas' && scope ? scope : kind;
  const name = collectionIndexes.has(collection) ? collection : 'index';
  if (!pendingIndexes.has(name)) {
    const request = fetch(`/api/v1/${name}.json`).then(async response => {
      if (!response.ok) throw new Error('Index unavailable');
      const index = await response.json();
      if (!Array.isArray(index.records)) throw new Error('Invalid index');
      return index.records;
    }).catch(error => {
      pendingIndexes.delete(name);
      throw error;
    });
    pendingIndexes.set(name, request);
  }
  return pendingIndexes.get(name);
}

function readForm(form) {
  const fields = new FormData(form);
  return Object.fromEntries(collectionFields.map(name => [
    name, String(fields.get(name) ?? '').trim().slice(0, maximumQueryLength)
  ]));
}

function setFormValue(form, name, value) {
  const field = form.elements.namedItem(name);
  if (!field) return;
  const fallback = field.value;
  field.value = value;
  if (!field.value && value) field.value = fallback;
}

function readPage(form) {
  const params = new URLSearchParams(location.search);
  for (const name of collectionFields) {
    if (params.has(name)) setFormValue(form, name, params.get(name).slice(0, maximumQueryLength));
  }
  const page = Number(params.get('page'));
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

function stateURL(state, page) {
  const url = new URL(location.href);
  for (const name of collectionFields) {
    const value = state[name];
    if (value && !(name === 'sort' && value === 'relevance')) url.searchParams.set(name, value);
    else url.searchParams.delete(name);
  }
  if (page > 1) url.searchParams.set('page', page);
  else url.searchParams.delete('page');
  return url;
}

function canonicalPath(path) {
  return path.replace(/\/+$/, '') || '/';
}

export function allowedReturn(value, origin) {
  if (!value || value.length > maximumReturnLength || !value.startsWith('/') || value.startsWith('//')) return null;
  try {
    const url = new URL(value, origin);
    const path = canonicalPath(url.pathname);
    if (url.origin !== origin || !returnPaths.has(path)) return null;
    for (const name of url.searchParams.keys()) {
      if (!returnParams.has(name)) return null;
    }
    if (url.hash && !/^#[A-Za-z][A-Za-z0-9_-]{0,119}$/u.test(url.hash)) return null;
    return `${path}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

function directoryHref(url) {
  const parsed = new URL(url, location.origin);
  const path = parsed.search && !parsed.pathname.endsWith('/') ? `${parsed.pathname}/` : parsed.pathname;
  return `${path}${parsed.search}${parsed.hash}`;
}

function recordLink(record, from) {
  const url = new URL(record.url, location.origin);
  if (url.origin !== location.origin || !/^\/(?:[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*)?$/u.test(url.pathname)) {
    throw new Error('Invalid collection destination');
  }
  if (from && canonicalPath(url.pathname) !== canonicalPath(location.pathname)) {
    url.searchParams.set('from', from);
  }
  const link = document.createElement('a');
  link.href = directoryHref(url);
  link.textContent = record.track === 'Extended' ? `Archive profile ${record.id}` : record.title;
  return link;
}

function renderRecord(record, container, from, columns, labelsByColumn) {
  const table = container.tagName === 'TBODY';
  const item = document.createElement(table ? 'tr' : 'li');
  item.dataset.recordId = record.id || record.url;
  const link = recordLink(record, from);
  if (table) {
    for (const column of columns) {
      const cell = document.createElement(column === 'title' ? 'th' : 'td');
      if (column === 'title') {
        cell.scope = 'row';
        cell.append(link);
      } else {
        cell.textContent = values(record[column]).filter(Boolean).join(', ') || '—';
      }
      item.append(cell);
    }
  } else {
    item.append(link);
    if (container.classList.contains('narrow-results')) {
      const facts = document.createElement('dl');
      facts.className = 'fact-list';
      for (const [index, field] of columns.entries()) {
        if (field === 'title') continue;
        const entry = document.createElement('div');
        const term = document.createElement('dt');
        const value = document.createElement('dd');
        term.textContent = labelsByColumn[index];
        value.textContent = values(record[field]).filter(Boolean).join(', ') || '—';
        entry.append(term, value);
        facts.append(entry);
      }
      item.append(facts);
      container.append(item);
      return;
    }
    const labels = [record.sector, record.gap, record.maturity, record.status, record.place]
      .filter(Boolean);
    if (labels.length) {
      const details = document.createElement('span');
      details.className = 'record-status';
      details.textContent = labels.join(', ');
      item.append(details);
    }
  }
  container.append(item);
}

function downloadFile(contents, filename, mimeType) {
  const url = URL.createObjectURL(new Blob([contents], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function filteredExport(records, state) {
  const fields = ['id', 'title', 'url', 'kind', ...facetFields, 'topics'];
  return JSON.stringify({
    scope: Object.fromEntries(Object.entries(state).filter(([, value]) => value)),
    count: records.length,
    records: records.map(record => Object.fromEntries(fields.map(name => [name, record[name]])
      .filter(([, value]) => value !== undefined)))
  }, null, 2);
}

function connectCollection(form) {
  const region = form.closest('[data-collection-region]') || form;
  const status = region.querySelector('[data-status]');
  const containers = [...region.querySelectorAll('[data-results]')];
  if (!status || !containers.length) return;
  const tableBody = containers.find(container => container.tagName === 'TBODY');
  const columns = tableBody?.dataset.columns.split(/\s+/u) ?? [];
  const labelsByColumn = tableBody ? [...tableBody.closest('table').tHead.rows[0].cells].map(cell => cell.textContent) : [];
  const clear = region.querySelector('[data-clear]');
  const exportButton = region.querySelector('[data-export]');
  const previous = region.querySelector('[data-previous]');
  const next = region.querySelector('[data-next]');
  let currentPage = readPage(form);
  const disclosure = form.querySelector('[data-filter-options]');
  if (disclosure) {
    const narrow = matchMedia('(max-width: 48rem)');
    const syncWidth = () => {
      disclosure.open = !narrow.matches || [...disclosure.querySelectorAll('select')].some(field => field.value);
    };
    syncWidth();
    narrow.addEventListener('change', syncWidth);
  }
  let state;
  let matches = [];
  let requestNumber = 0;

  function exposeActions(lastPage = 1) {
    if (exportButton) exportButton.disabled = !matches.length;
    if (previous) previous.disabled = lastPage <= 1 || currentPage <= 1;
    if (next) next.disabled = currentPage >= lastPage;
    const pages = region.querySelector('[data-pagination]');
    if (pages) pages.hidden = lastPage <= 1;
  }

  function show(page) {
    const lastPage = Math.max(1, Math.ceil(matches.length / pageSize));
    currentPage = Math.min(lastPage, Math.max(1, page));
    const start = (currentPage - 1) * pageSize;
    const selection = matches.slice(start, start + pageSize);
    const url = stateURL(state, currentPage);
    history.replaceState(null, '', url);
    const from = allowedReturn(`${url.pathname}${url.search}${url.hash}`, location.origin);
    for (const container of containers) {
      container.replaceChildren();
      for (const record of selection) renderRecord(record, container, from, columns, labelsByColumn);
    }
    if (matches.length) {
      const noun = matches.length === 1 ? 'result' : 'results';
      const count = `${matches.length} ${noun}`;
      status.textContent = lastPage === 1 ? `${count}.` : `${count}. Showing ${start + 1}–${start + selection.length}.`;
    } else {
      status.textContent = 'No matches. Try a different name or clear the filters.';
    }
    exposeActions(lastPage);
  }

  async function apply(page = 1) {
    const request = ++requestNumber;
    state = readForm(form);
    currentPage = page;
    matches = [];
    exposeActions();
    history.replaceState(null, '', stateURL(state, page));
    if (form.dataset.collection === 'all' && !state.q && !state.id) {
      for (const container of containers) {
        container.replaceChildren();
        container.removeAttribute('aria-busy');
      }
      status.textContent = 'Enter a name, topic or specification ID.';
      return;
    }
    status.textContent = 'Finding records…';
    for (const container of containers) {
      container.replaceChildren();
      container.setAttribute('aria-busy', 'true');
    }
    try {
      const records = await getIndex(form.dataset.collection, state.scope);
      if (request !== requestNumber) return;
      matches = filterCollection(records, form.dataset.collection, state);
      show(currentPage);
    } catch {
      if (request !== requestNumber) return;
      status.textContent = 'Results are temporarily unavailable. Apply the filters to retry or browse the links on this page.';
    } finally {
      if (request === requestNumber) {
        for (const container of containers) container.removeAttribute('aria-busy');
      }
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    void apply();
  });
  clear?.addEventListener('click', event => {
    event.preventDefault();
    form.reset();
    void apply();
  });
  exportButton?.addEventListener('click', () => {
    if (!matches.length) return;
    downloadFile(filteredExport(matches, state), 'nigeriastack-filtered-records.json', 'application/json');
  });
  function movePage(offset, button) {
    show(currentPage + offset);
    if (button.disabled) {
      status.tabIndex = -1;
      status.focus();
    }
  }

  previous?.addEventListener('click', () => movePage(-1, previous));
  next?.addEventListener('click', () => movePage(1, next));
  form.addEventListener('change', event => {
    if (event.target instanceof HTMLSelectElement || event.target.type === 'radio') void apply();
  });
  const isLargeDirectory = ['atlas', 'councils'].includes(form.dataset.collection);
  if (isLargeDirectory && !Object.values(readForm(form)).some(Boolean) && currentPage === 1) {
    status.textContent = 'Search by name or browse the directory links.';
  } else {
    void apply(currentPage);
  }
}

function connectReturnLinks() {
  const from = allowedReturn(new URLSearchParams(location.search).get('from'), location.origin);
  if (!from) return;
  const path = canonicalPath(new URL(from, location.origin).pathname);
  for (const link of document.querySelectorAll('[data-return-collection]')) {
    if (canonicalPath(new URL(link.href).pathname) === path) link.href = directoryHref(from);
  }
  if (path === '/search') {
    const link = document.querySelector('[data-return-search]');
    if (link) {
      link.href = directoryHref(from);
      link.hidden = false;
    }
  }
}

function findFragment() {
  try {
    return document.getElementById(decodeURIComponent(location.hash.slice(1)));
  } catch {
    return null;
  }
}

function connectDisclosures() {
  const groupFilter = document.querySelector('[data-group-filter]');
  const groups = [...document.querySelectorAll('details[data-working-group]')];
  const groupStatus = document.querySelector('[data-group-status]');
  const optionExists = id => groups.some(group => group.id === id);

  function applyGroup(value) {
    const selected = optionExists(value) ? value : '';
    if (groupFilter) groupFilter.value = selected;
    for (const group of groups) group.hidden = Boolean(selected && group.id !== selected);
    const url = new URL(location.href);
    if (selected) url.searchParams.set('wg', selected);
    else url.searchParams.delete('wg');
    history.replaceState(null, '', url);
    if (groupStatus) groupStatus.textContent = selected ? 'Showing the matching Working Group.' : 'Showing all Working Groups.';
  }

  function openTarget() {
    const target = findFragment();
    const details = target?.closest('details[data-working-group], details[data-answer], details[data-outline]');
    if (!details) return;
    if (details.matches('[data-outline]')) {
      details.open = true;
      target.scrollIntoView({ block: 'start' });
      return;
    }
    if (details.hidden && details.matches('[data-working-group]')) applyGroup(details.id);
    details.open = true;
    const summary = details.querySelector('summary');
    requestAnimationFrame(() => {
      summary?.focus({ preventScroll: true });
      details.scrollIntoView({ block: 'start' });
    });
  }

  if (groupFilter) {
    const initial = new URL(location.href).searchParams.get('wg');
    applyGroup(initial);
    groupFilter.addEventListener('change', () => {
      const selected = groupFilter.value;
      const url = new URL(location.href);
      url.hash = selected || 'working-groups';
      history.replaceState(null, '', url);
      applyGroup(selected);
      if (selected) document.getElementById(selected).open = true;
    });
  }
  for (const element of document.querySelectorAll('details[data-working-group], details[data-answer]')) {
    const summary = element.querySelector('summary');
    const anchor = element.dataset.answer;
    const fragment = (anchor && document.getElementById(anchor) ? anchor : '')
      || element.id || summary?.id || summary?.querySelector('[id]')?.id;
    if (!summary || !fragment) continue;
    summary.addEventListener('click', event => {
      if (event.target.closest('a, button')) return;
      const url = new URL(location.href);
      if (!element.open) url.hash = fragment;
      else if (findFragment()?.closest('details') === element) url.hash = '';
      history.replaceState(null, '', url);
    });
  }
  for (const button of document.querySelectorAll('[data-copy-answer]')) {
    const details = button.closest('[data-answer]');
    const status = details.querySelector('[data-answer-status]');
    button.addEventListener('click', async () => {
      const url = new URL(location.pathname, location.origin);
      url.hash = details.dataset.answer;
      try {
        await navigator.clipboard.writeText(url.href);
        status.textContent = 'Answer link copied.';
      } catch {
        history.replaceState(null, '', url);
        status.textContent = 'The answer link is in the address bar.';
      }
    });
  }
  window.addEventListener('hashchange', openTarget);
  openTarget();
}

function connectDraft(form) {
  const params = new URLSearchParams(location.search);
  for (const name of ['group', 'task', 'rfc', 'revision']) {
    if (params.has(name)) setFormValue(form, name, params.get(name).slice(0, maximumQueryLength));
  }
  const output = form.querySelector('[data-draft-output]');
  const status = form.querySelector('[data-draft-status]');
  const copy = form.querySelector('[data-copy-draft]');
  const download = form.querySelector('[data-download-draft]');

  function update() {
    const data = new FormData(form);
    const contents = Object.entries(draftFields).map(([name, label]) => {
      const field = form.elements.namedItem(name);
      const text = field instanceof HTMLSelectElement ? field.selectedOptions[0]?.textContent : data.get(name);
      return `${label}\n${String(text ?? '').trim()}`;
    });
    const draft = ['NigeriaStack contribution draft', ...contents].join('\n\n');
    if (output) {
      output.value = draft;
      output.hidden = false;
    }
    return draft;
  }

  function say(message) {
    if (status) status.textContent = message;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    update();
    say('Local draft prepared. You can copy or download it.');
  });
  form.addEventListener('input', () => {
    if (output && !output.hidden) output.hidden = true;
    say('');
  });
  copy?.addEventListener('click', async () => {
    if (!form.reportValidity()) return;
    const draft = update();
    try {
      await navigator.clipboard.writeText(draft);
      say('Local draft copied.');
    } catch {
      output?.focus();
      output?.select();
      say('Clipboard access is unavailable. Copy the selected draft manually.');
    }
  });
  download?.addEventListener('click', () => {
    if (!form.reportValidity()) return;
    downloadFile(update(), 'nigeriastack-contribution-draft.txt', 'text/plain;charset=utf-8');
    say('Local draft ready to download.');
  });
  for (const fields of form.querySelectorAll('fieldset[data-draft-fields]')) fields.disabled = false;
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('form[data-collection]').forEach(connectCollection);
  document.querySelectorAll('form[data-proposal-draft]').forEach(connectDraft);
  connectReturnLinks();
  connectDisclosures();
}
