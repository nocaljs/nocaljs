import { add, model, tags } from '../../nocal.js';

export function mount(target) {
  const { div, input, label, p, pre } = tags();
  const profile = model({ name: 'Ada', project: 'A small web app' });
  add(target, div({ class: 'demo-controls' },
    label({ for: 'profile-name' }, 'Your name'),
    input({ id: 'profile-name', value: profile.name, oninput: event => { profile.name.value = event.target.value; } }),
    label({ for: 'profile-project' }, 'What are you building?'),
    input({ id: 'profile-project', value: profile.project, oninput: event => { profile.project.value = event.target.value; } }),
    p({ role: 'status' }, () => `${profile.name.value || 'Someone'} is building ${profile.project.value || 'something new'}.`),
    pre({ class: 'model-preview', 'aria-label': 'Current model' }, () => JSON.stringify(profile.json(), null, 2))
  ));
}
