import {useActionState, use} from 'react';

import {OpinionsContext} from '../store/opinions-context';
import Submit from './Submit.jsx';

export function NewOpinion() {
  const {addOpinion} = use(OpinionsContext);

  async function submitAction(prevState, formData) {
    const userName = formData.get('userName');
    const title = formData.get('title');
    const body = formData.get('body');

    let errors = [];
    if (!userName.trim()) errors.push('Please provide your name');
    if (!title || title.trim().length < 5)
      errors.push('Title must be at least 5 characters long');
    if (!body || body.trim().length < 10 || body.trim().length > 300)
      errors.push('Body must be between 10 and 300 characters long');

    if (errors.length > 0) {
      return {errors, enteredValues: {userName, title, body}};
    }

    await addOpinion({userName, title, body});
    return {errors: null};
    // console.log({userName, title, body});
  }

  const [actionState, dispatch] = useActionState(submitAction, {errors: null});

  return (
    <div id='new-opinion'>
      <h2>Share your opinion!</h2>
      <form action={dispatch}>
        <div className='control-row'>
          <p className='control'>
            <label htmlFor='userName'>Your Name</label>
            <input
              type='text'
              id='userName'
              name='userName'
              defaultValue={actionState.enteredValues?.userName}
            />
          </p>

          <p className='control'>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              id='title'
              name='title'
              defaultValue={actionState.enteredValues?.title}
            />
          </p>
        </div>
        <p className='control'>
          <label htmlFor='body'>Your Opinion</label>
          <textarea
            id='body'
            name='body'
            rows={5}
            defaultValue={actionState.enteredValues?.body}></textarea>
        </p>
        {actionState?.errors?.length > 0 && (
          <div className='errors'>
            <p>Please fix the following errors:</p>
            <ul>
              {actionState.errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <Submit />
      </form>
    </div>
  );
}
