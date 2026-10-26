import { add, derive, state, tags } from '../../nocal.js';

export function mount(target) {
  const { button, div, form, input, label, p, span, ul, li } = tags();
  let nextId = 1;
  const tasks = state([{ id: nextId++, text: 'Try NocalJS', done: false }]);
  const completed = derive(() => tasks.value.filter(task => task.done).length);
  const entry = input({ id: 'new-task', name: 'task', required: true, maxlength: 80, autocomplete: 'off' });
  const toggle = (id, done) => {
    tasks.value = tasks.value.map(task => task.id === id ? { ...task, done } : task);
    queueMicrotask(() => target.querySelector(`[data-task="${id}"] input`)?.focus());
  };
  add(target, div({ class: 'demo-controls' },
    form({ onsubmit: event => {
      event.preventDefault();
      const text = entry.value.trim();
      if (!text) return;
      tasks.value = [...tasks.value, { id: nextId++, text, done: false }];
      entry.value = '';
      entry.focus();
    } }, label({ for: 'new-task' }, 'New task'), div({ class: 'input-row' }, entry, button({ type: 'submit' }, 'Add task'))),
    () => ul({ class: 'todo-list' }, tasks.value.map(task => li({ 'data-task': task.id },
      label(input({ type: 'checkbox', checked: task.done, onchange: event => toggle(task.id, event.target.checked) }),
        span({ class: task.done ? 'completed' : '' }, task.text)),
      button({ type: 'button', 'aria-label': `Remove ${task.text}`, onclick: () => {
        tasks.value = tasks.value.filter(item => item.id !== task.id);
        entry.focus();
      } }, 'Remove')
    ))),
    p({ role: 'status' }, () => `${completed.value} of ${tasks.value.length} completed`)
  ));
}
