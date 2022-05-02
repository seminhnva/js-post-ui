import postApi from './api/postApi';

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

    console.log(defaultValues);
  } catch (error) {
    console.log(error);
  }
})();
