import { randomNumber, setBackgroundImage, setFieldContent, setTextContents } from './common';
import * as yup from 'yup';

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};

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
    imageSource: yup
      .string()
      .required('Please select image')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'INVALID IMAGE'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please random a background image')
        .url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select image to uploadd', (file) => Boolean(file?.name))
        .test('max3mb', 'Image is too large ( maxium 50kb) ', (file) => {
          const fileSize = file?.size || 0;
          const max_size = 50 * 1024; // 50kb
          return fileSize <= max_size;
        }),
    }),
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
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''));
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
  return isValid;
}

async function validateFormField(form, formValues, name) {
  try {
    setFieldError(form, name, '');
    const schema = getPostSchema();

    await schema.validateAt(name, formValues);
  } catch (error) {
    console.log(error);
    setFieldError(form, name, error.message);
  }
  //show validation if err
  const field = form.querySelector(`[name="submit"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}

function showLoading(form) {
  const button = form.querySelector(`[name="submit"]`);
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }
}
function hideLoading(form) {
  const button = form.querySelector(`[name="submit"]`);
  if (button) {
    button.disabled = false;
    button.textContent = 'Save';
  }
}
function initRandomImage(form) {
  const button = document.getElementById('postChangeImage');
  if (!button) return;
  button.addEventListener('click', () => {
    // random ID
    //build URl
    //set ImageURL input + background
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;
    setFieldContent(form, `[name="imageUrl"]`, imageUrl); //hiden input
    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll(`[data-id="imageSource"]`);
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}

function initRandomImageSource(form) {
  const radioList = form.querySelectorAll(`[name="imageSource"]`);
  radioList.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      renderImageSourceControl(form, e.target.value);
    });
  });
}

function initUploadImage(form) {
  const uploadImage = form.querySelector(`[name="image"]`);
  uploadImage.addEventListener('change', (e) => {
    //get selected file
    //preview file
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(document, '#postHeroImage', imageUrl);

      validateFormField(form, { imageSource: ImageSource.UPLOAD, image: file }, 'image');
    }
  });
}

function initValidationOnChange(form) {
  ['title', 'author'].forEach((name) => {
    let field = form.querySelector(`[name="${name}"]`);
    if (field) {
      field.addEventListener('input', (e) => {
        const newValue = e.target.value;
        validateFormField(form, { [name]: newValue }, name);
      });
    }
  });
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  let submitting = false;

  setFormValues(form, defaultValue);

  //init
  initRandomImage(form);
  initRandomImageSource(form);
  initUploadImage(form);
  initValidationOnChange(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    //get form value

    if (submitting) {
      return;
    }
    showLoading(form);
    submitting = true;

    const formValues = getFormValues(form);
    formValues.id = defaultValue.id;
    //validation

    const isValid = await validatePostForm(form, formValues);
    if (isValid) await onSubmit?.(formValues);
    //if valid triiger submid callback
    //otherwise//show validation error

    hideLoading(form);
    submitting = false;
  });
}
