'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';

import ImagePicker from '@/components/meals/image-picker.js'
import classes from './page.module.css';
import MealsFormSubmit from '../meals-form-submit';
import Notification from '@/components/notification/Notification';
import { shareMeal } from '@/lib/actions'

const schema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  title: yup.string().trim().required('Title is required'),
  summary: yup.string().trim().required('Summary is required'),
  instructions: yup.string().trim().required('Instructions are required'),
  image: yup
    .mixed()
    .test('required', 'Image is required', (value) => value && value.length > 0)
    .test('fileType', 'Only PNG or JPEG files are allowed', (value) => {
      if (!value || value.length === 0) return false;
      return ['image/png', 'image/jpeg', 'image/webp'].includes(value[0].type);
    })
    .test('fileSize', 'Image size is too large. Max size is 20MB', (value) => {
      if (!value || value.length === 0) return true;
      return value[0].size <= 20 * 1024 * 1024;
    }),
  captchaToken: yup.string().required('Please complete the CAPTCHA'),
});

export default function ShareMealPage() {
  const [message, setMessage] = useState(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image') {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await shareMeal(formData);
      setMessage(response.message);
    } catch (error) {
      setMessage('An error occurred while submitting the form.');
    }
  };

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.row}>
            <p>
              <label htmlFor='name'>Your name</label>
              <input type='text' id='name' {...register('name')} />
              {errors.name && <span>{errors.name.message}</span>}
            </p>
            <p>
              <label htmlFor='email'>Your email</label>
              <input type='email' id='email' {...register('email')} />
              {errors.email && <span>{errors.email.message}</span>}
            </p>
          </div>
          <p>
            <label htmlFor='title'>Title</label>
            <input type='text' id='title' {...register('title')} />
            {errors.title && <span>{errors.title.message}</span>}
          </p>
          <p>
            <label htmlFor='summary'>Short Summary</label>
            <input type='text' id='summary' {...register('summary')} />
            {errors.summary && <span>{errors.summary.message}</span>}
          </p>
          <p>
            <label htmlFor='instructions'>Instructions</label>
            <textarea
              id='instructions'
              rows='10'
              {...register('instructions')}
            ></textarea>
            {errors.instructions && <span>{errors.instructions.message}</span>}
          </p>
          <Controller
            name='image'
            control={control}
            defaultValue={[]}
            render={({ field: {onChange, ref} }) => (
                <ImagePicker
                  label='Your image'
                  name='image'
                  onChange={onChange}
                  inputRef={ref}
                >
                  {errors.image && <span>{errors.image.message}</span>}
                </ImagePicker>
            )}
          />
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={(token) => setValue('captchaToken', token)}
          />
          <input type='hidden' {...register('captchaToken')} />
          {errors.captchaToken && <span>{errors.captchaToken.message}</span>}
          <p className={classes.actions}>
            <MealsFormSubmit isSubmitting={isSubmitting} />
          </p>
          {message && <Notification message={message} />}
        </form>
      </main>
    </>
  );
}
