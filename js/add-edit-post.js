import { functionsIn } from 'lodash';
import postApi from './api/postApi';
import { initPostForm, randomNumber, toast } from './utils';
function removeUnusedFields(formValues) {
  // imageSource Picsum => remove image
  // upload => remove imageUrl
  const payload = { ...formValues };
  if (payload.imageSource === 'upload') {
    delete payload.imageUrl;
  } else {
    delete payload.image;
  }
  delete payload.imageSource;
  //remove id if its add mode
  if (!payload.id) delete payload.id;
  return payload;
}
function jsonToFormData(jsObject) {
  const formData = new FormData();
  for (const key in jsObject) {
    formData.set(key, jsObject[key]);
  }
  return formData;
}

async function handlePostFormSubmit(formValues) {
  const payload = removeUnusedFields(formValues);
  const formData = jsonToFormData(payload);
  try {
    //check add/edit
    //call aPI
    const savedPost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    //show sucess mesage
    toast.success('Save Post successfully');
    //redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 2000);
  } catch (error) {
    console.log(error);
    toast.error(`Error : ${error.message}`);
  }
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
          imageUrl: `https://picsum.photos/id/${randomNumber(1000)}/1368/400`,
        };

    initPostForm({
      formId: 'postForm',
      defaultValue: defaultValues,
      onSubmit: (formValues) => handlePostFormSubmit(formValues),
    });
  } catch (error) {
    console.log(error);
  }
})();
