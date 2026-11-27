const searchIndex = '/api/v1/index.json';
const maximumQueryLength = 120;
const maximumResults = 30;

function normalize(value) {
  return value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

export function findRecords(records, query, scope = 'all') {
  const value = normalize(query);
  if (!value || query.length > maximumQueryLength) return { total: 0, records: [] };
  const words = value.split(/\s+/u);
  const results = [];
  for (const record of records) {
    if (scope !== 'all' && record.kind !== scope) continue;
    const title = normalize(record.title);
    const id = normalize(record.id);
    const fields = [id, title, ...record.headings.map(normalize)];
    if (!words.every(word => fields.some(field => field.includes(word))) && !fields.includes(value)) continue;
    const score = id === value ? 4 : title === value ? 3 : title.includes(value) ? 2 : 1;
    results.push({ record, score });
  }
  results.sort((a, b) => b.score - a.score);
  return { total: results.length, records: results.slice(0, maximumResults).map(result => result.record) };
}

function connectSearch(form) {
  const input = form.querySelector('input');
  const status = form.querySelector('[data-status]');
  const list = form.querySelector('[data-results]');
  let pendingIndex;
  let requestNumber = 0;

  async function search() {
    const current = ++requestNumber;
    const query = input.value.trim();
    list.replaceChildren();
    if (!query) {
      status.textContent = 'Enter a name, topic or identifier.';
      return;
    }
    const url = new URL(location.href);
    url.searchParams.set('q', query);
    history.replaceState(null, '', url);
    status.textContent = 'Searching…';
    try {
      pendingIndex ??= fetch(searchIndex).then(response => {
        if (!response.ok) throw new Error('Index unavailable');
        return response.json();
      }).catch(error => {
        pendingIndex = undefined;
        throw error;
      });
      const { records } = await pendingIndex;
      if (current !== requestNumber) return;
      const result = findRecords(records, query, form.dataset.search);
      status.textContent = result.total
        ? `Showing ${result.records.length} of ${result.total} matching records.`
        : 'No records found. Try a shorter name or an exact identifier.';
      for (const record of result.records) {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = record.url;
        link.textContent = record.title;
        item.append(link);
        list.append(item);
      }
    } catch {
      if (current === requestNumber) status.textContent = 'Search is temporarily unavailable. Try again or browse the directory links.';
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    void search();
  });
  const initialQuery = new URLSearchParams(location.search).get('q');
  if (initialQuery && initialQuery.length <= maximumQueryLength) {
    input.value = initialQuery;
    void search();
  }
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('form[data-search]').forEach(connectSearch);
}
