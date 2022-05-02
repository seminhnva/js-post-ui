import postApi from './api/postApi';
import { initPostForm } from './utils';

function onSubmit(formValue) {
    console.log(formValue);
}

(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postID = searchParams.get('id');
    //   check add or edit

    const defaultValues = postID
      ? await postApi.getById(postID)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValue: defaultValues,
      onSubmit: (formValue) => onSubmit(formValue),
    });
  } catch (error) {
    console.log(error);
  }
})();
