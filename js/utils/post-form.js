import { setBackgroundImage, setFieldContent, setTextContents } from './common';
import * as yup from 'yup';
function setFormValues(form, formValues) {
  setFieldContent(form, `[name="title"]`, formValues?.title);
  setFieldContent(form, `[name="author"]`, formValues?.author);
  setFieldContent(form, `[name="description"]`, formValues?.description);
  setFieldContent(form, `[name="imageUrl"]`, formValues?.imageUrl); //hiden input
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
  document.getElementById('hero');
}
// **** method1: get input value
// function getFormValues(form) {
//   const formValues = {};
//   const nameInput = ['title', 'author', 'description', 'imageUrl'];
//   nameInput.forEach((name) => {
//     //get value
//     let field = form.querySelector(`[name="${name}"]`);
//     if (field) formValues[name] = field.value;
//   });
//   return formValues;
// }
function getFormValues(form) {
  const formValues = {};
  let formData = new FormData(form);
  for (const [key, value] of formData) {
    formValues[key] = value;
  }
  return formValues;
}
function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup.string().required('Please enter author'),
    description: yup.string(),
  });
}
function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContents(element.parentElement, '.invalid-feedback', error);
  }
}
async function validatePostForm(form, formValues) {
  try {
    ['title', 'author'].forEach((name) => setFieldError(form, name, ''));
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
    //add was-validated class to form element
  } catch (error) {
    const errorLog = {};
    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;
        //ignore if the field is already logged
        if (errorLog[name]) continue;
        //set filed error n mark as logged
        setFieldError(form, name, validationError.message);
        error[name] = true;
      }
    }
  }

  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return false;
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;
  console.log(form);
  setFormValues(form, defaultValue);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    //get form value
    const formValues = getFormValues(form);
    //validation

    if (!validatePostForm(form, formValues)) return;
    //if valid triiger submid callback
    //otherwise//show validation error
  });
}
